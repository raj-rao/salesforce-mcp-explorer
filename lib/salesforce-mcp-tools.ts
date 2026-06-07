import { createSalesforceMcpClient } from "./salesforce-mcp";

export async function executeTool(
  accessToken: string,
  toolName: string,
  args: Record<string, unknown> = {}
) {
  const client =
    await createSalesforceMcpClient(
      accessToken
    );

  try {
    const result = await client.callTool({
      name: toolName,
      arguments: args,
    });

    return result;
  } finally {
    try {
      await client.close();
    } catch {
      // ignore cleanup errors
    }
  }
}

export async function getUserInfo(
  accessToken: string
) {
  return executeTool(
    accessToken,
    "getUserInfo",
    {}
  );
}

export async function getObjectSchema(
  accessToken: string,
  objects?: string
) {
  return executeTool(
    accessToken,
    "getObjectSchema",
    objects
      ? { objects }
      : {}
  );
}

export async function runSoqlQuery(
  accessToken: string,
  query: string
) {
  return executeTool(
    accessToken,
    "soqlQuery",
    {
      q: query,
    }
  );
}

export async function runSoslSearch(
  accessToken: string,
  search: string
) {
  return executeTool(
    accessToken,
    "find",
    {
      q: search,
    }
  );
}

export async function getRecentRecords(
  accessToken: string,
  sobjectName: string
) {
  return executeTool(
    accessToken,
    "listRecentSobjectRecords",
    {
      "sobject-name": sobjectName,
    }
  );
}

export async function getRelatedRecords(
  accessToken: string,
  sobjectName: string,
  recordId: string,
  relationshipPath: string
) {
  return executeTool(
    accessToken,
    "getRelatedRecords",
    {
      "sobject-name": sobjectName,
      id: recordId,
      "relationship-path":
        relationshipPath,
    }
  );
}