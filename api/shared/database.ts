import { CosmosClient, Container } from "@azure/cosmos";

let cosmosClient: CosmosClient;
let database: any;

export function getCosmosClient() {
  if (!cosmosClient) {
    cosmosClient = new CosmosClient({
      endpoint: process.env.COSMOS_ENDPOINT || "",
      key: process.env.COSMOS_KEY || "",
    });
    database = cosmosClient.database("friendindeed");
  }
  return { client: cosmosClient, database };
}

export function getNeedsContainer(): Container {
  const { database } = getCosmosClient();
  return database.container("needs");
}

export function getOrganizationsContainer(): Container {
  const { database } = getCosmosClient();
  return database.container("organizations");
}

export function getUsersContainer(): Container {
  const { database } = getCosmosClient();
  return database.container("users");
}