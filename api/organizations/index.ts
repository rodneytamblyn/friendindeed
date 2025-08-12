import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getOrganizationsContainer } from "../shared/database";

async function organizationsHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    if (request.method === "OPTIONS") {
      return { status: 200, headers: corsHeaders };
    }

    const container = getOrganizationsContainer();
    
    const querySpec = {
      query: "SELECT * FROM c WHERE c.isActive = true ORDER BY c.name"
    };
    
    const { resources } = await container.items.query(querySpec).fetchAll();
    
    return {
      status: 200,
      headers: corsHeaders,
      body: JSON.stringify(resources)
    };
  } catch (error) {
    context.error('Error fetching organizations:', error);
    return {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}

app.http('organizations', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: organizationsHandler
});