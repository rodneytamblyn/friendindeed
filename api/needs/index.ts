import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getNeedsContainer } from "../shared/database";
import { getAuthUser, requireAuth, getUserEmail } from "../shared/auth";

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-ms-client-principal"
  };

  try {
    if (req.method === "GET") {
      await handleGetNeeds(context, req);
    } else if (req.method === "POST") {
      await handleCreateNeed(context, req);
    }
    
    // Add CORS headers to response
    context.res.headers = { ...context.res.headers, ...corsHeaders };
  } catch (error) {
    context.log.error('Error in needs endpoint:', error);
    context.res = {
      status: 500,
      headers: corsHeaders,
      body: { error: 'Internal server error' }
    };
  }
};

async function handleGetNeeds(context: Context, req: HttpRequest) {
  const container = getNeedsContainer();
  
  // Build query based on filters
  const { organization, location, category, status } = req.query;
  
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
  
  context.res = {
    status: 200,
    body: resources
  };
}

async function handleCreateNeed(context: Context, req: HttpRequest) {
  const user = requireAuth(req);
  const container = getNeedsContainer();
  
  const needData = {
    id: generateId(),
    type: 'need',
    ...req.body,
    requesterId: user.userId,
    requesterEmail: getUserEmail(user),
    status: 'open',
    createdAt: new Date().toISOString()
  };
  
  const { resource } = await container.items.create(needData);
  
  context.res = {
    status: 201,
    body: resource
  };
}

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export default httpTrigger;