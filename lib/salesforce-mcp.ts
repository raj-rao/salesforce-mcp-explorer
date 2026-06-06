import { Client } from "@modelcontextprotocol/sdk/client/index.js";

export async function createSalesforceMcpClient() {
  const client = new Client({
    name: "salesforce-mcp-explorer",
    version: "0.1.0",
  });

  return client;
}