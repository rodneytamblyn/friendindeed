import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getOrganizationsContainer } from "../shared/database";

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  try {
    const container = getOrganizationsContainer();
    
    const querySpec = {
      query: "SELECT * FROM c WHERE c.isActive = true ORDER BY c.name"
    };
    
    const { resources } = await container.items.query(querySpec).fetchAll();
    
    context.res = {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: resources
    };
  } catch (error) {
    context.log.error('Error fetching organizations:', error);
    context.res = {
      status: 500,
      body: { error: 'Internal server error' }
    };
  }
};

export default httpTrigger;