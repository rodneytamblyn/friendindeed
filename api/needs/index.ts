import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getNeedsContainer } from "../shared/database";
import { getAuthUser, requireAuth, getUserEmail } from "../shared/auth";

async function needsHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-ms-client-principal"
  };

  try {
    if (request.method === "OPTIONS") {
      return { status: 200, headers: corsHeaders };
    }

    if (request.method === "GET") {
      return await handleGetNeeds(request, context, corsHeaders);
    } else if (request.method === "POST") {
      return await handleCreateNeed(request, context, corsHeaders);
    }
    
    return {
      status: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    context.error('Error in needs endpoint:', error);
    return {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}

async function handleGetNeeds(request: HttpRequest, context: InvocationContext, corsHeaders: any): Promise<HttpResponseInit> {
  const container = getNeedsContainer();
  
  // Build query based on filters
  const url = new URL(request.url);
  const organization = url.searchParams.get('organization');
  const location = url.searchParams.get('location');
  const category = url.searchParams.get('category');
  const status = url.searchParams.get('status');
  
  let whereClause = "WHERE c.type = 'need'";
  const parameters: any[] = [];
  
  if (organization) {
    whereClause += " AND c.organizationId = @organization";
    parameters.push({ name: "@organization", value: organization });
  }
  
  if (location) {
    whereClause += " AND CONTAINS(LOWER(c.location), LOWER(@location))";
    parameters.push({ name: "@location", value: location });
  }
  
  if (category) {
    whereClause += " AND c.category = @category";
    parameters.push({ name: "@category", value: category });
  }
  
  if (status) {
    whereClause += " AND c.status = @status";
  } else {
    // Default to only open needs for public view
    whereClause += " AND c.status = 'open'";
  }
  
  const querySpec = {
    query: `SELECT * FROM c ${whereClause} ORDER BY c.createdAt DESC`,
    parameters
  };
  
  const { resources } = await container.items.query(querySpec).fetchAll();
  
  return {
    status: 200,
    headers: corsHeaders,
    body: JSON.stringify(resources)
  };
}

async function handleCreateNeed(request: HttpRequest, context: InvocationContext, corsHeaders: any): Promise<HttpResponseInit> {
  const user = requireAuth(request);
  const container = getNeedsContainer();
  
  const body = await request.json();
  
  const needData = {
    id: generateId(),
    type: 'need',
    ...(body as object),
    requesterId: user.userId,
    requesterEmail: getUserEmail(user),
    status: 'open',
    createdAt: new Date().toISOString()
  };
  
  const { resource } = await container.items.create(needData);
  
  return {
    status: 201,
    headers: corsHeaders,
    body: JSON.stringify(resource)
  };
}

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

app.http('needs', {
  methods: ['GET', 'POST', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: needsHandler
});