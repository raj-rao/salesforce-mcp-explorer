/* ORIGINAL CODE
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
export async function createSalesforceMcpClient() {
  const client = new Client({
    name: "salesforce-mcp-explorer",
    version: "0.1.0",
  });

  return client;
}
*/

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export async function createSalesforceMcpClient(
  accessToken: string
) {
  const client = new Client({
    name: "salesforce-mcp-explorer",
    version: "0.1.0",
  });

  const transport =
    new StreamableHTTPClientTransport(
      new URL(process.env.SALESFORCE_MCP_URL!),
      {
        requestInit: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    );

  await client.connect(transport);

  return client;
}
