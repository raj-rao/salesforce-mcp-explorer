import { createSalesforceMcpClient } from "./salesforce-mcp";

//
// Generic Salesforce MCP Result
//

export type SalesforceToolResult<T> = {
  structuredContent: T;
};

//
// User Info Types
//

export type UserInfo = {
  identity: {
    companyName: string;
    displayName: string;
    email: string;
    firstName: string;
    lastName: string;
    profileId: string;
    profileName: string;
    userId: string;
    username: string;
    isActive: boolean;
  };
  userTimeAndLocale: {
    humanReadableTime: string;
    localTimeIso: string;
    localeCode: string;
    timeZoneIana: string;
  };
};

//
// Schema Types
//

export type SalesforceObject = {
  name: string;
  label: string;
  custom: boolean;
};

export type SchemaResult = {
  details: unknown[];
  index: {
    objectCount: number;
    objects: SalesforceObject[];
  };
};

//
// SOQL Types
//

export type SoqlRecord = {
  Id?: string;
  Name?: string;
  [key: string]: unknown;
};

export type SoqlQueryResult = {
  totalSize: number;
  done: boolean;
  records: SoqlRecord[];
};

//
// Base Tool Executor
//

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
    const result =
      await client.callTool({
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

//
// User Info
//

export async function getUserInfo(
  accessToken: string
): Promise<
  SalesforceToolResult<UserInfo>
> {
  return (await executeTool(
    accessToken,
    "getUserInfo",
    {}
  )) as unknown as SalesforceToolResult<UserInfo>;
}

//
// Object Schema
//

export async function getObjectSchema(
  accessToken: string,
  objects?: string
): Promise<
  SalesforceToolResult<SchemaResult>
> {
  return (await executeTool(
    accessToken,
    "getObjectSchema",
    objects
      ? { objects }
      : {}
  )) as unknown as SalesforceToolResult<SchemaResult>;
}

//
// SOQL Query
//

export async function runSoqlQuery(
  accessToken: string,
  query: string
): Promise<
  SalesforceToolResult<SoqlQueryResult>
> {
  return (await executeTool(
    accessToken,
    "soqlQuery",
    {
      q: query,
    }
  )) as unknown as SalesforceToolResult<SoqlQueryResult>;
}

//
// SOSL Search
//

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

//
// Recent Records
//

export async function getRecentRecords(
  accessToken: string,
  sobjectName: string
) {
  return executeTool(
    accessToken,
    "listRecentSobjectRecords",
    {
      "sobject-name":
        sobjectName,
    }
  );
}

//
// Related Records
//

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
      "sobject-name":
        sobjectName,
      id: recordId,
      "relationship-path":
        relationshipPath,
    }
  );
}