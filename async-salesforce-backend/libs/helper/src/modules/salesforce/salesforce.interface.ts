import * as jsforce from 'jsforce';

export interface SalesforceConnectionConfig {
  instanceUrl: string;
  accessToken: string;
  refreshToken?: string;
  clientId?: string;
  clientSecret?: string;
}

export interface SalesforceOAuth2Config {
  loginUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface ISalesforceService {
  /**
   * Create a Salesforce connection using OAuth2 (for authorization flow)
   */
  createOAuth2Connection(
    connectionId: string,
    config: SalesforceOAuth2Config,
  ): jsforce.Connection;

  /**
   * Get OAuth2 authorization URL
   */
  getAuthorizationUrl(connectionId: string, scopes?: string[]): string | null;

  /**
   * Authorize OAuth2 connection with authorization code
   */
  authorizeOAuth2(
    connectionId: string,
    code: string,
  ): Promise<jsforce.UserInfo>;

  /**
   * Create a Salesforce connection using access token (already authorized)
   */
  createConnection(
    connectionId: string,
    config: SalesforceConnectionConfig,
  ): jsforce.Connection;

  /**
   * Get existing connection by ID
   */
  getConnection(connectionId: string): jsforce.Connection | undefined;

  /**
   * Remove connection from cache
   */
  removeConnection(connectionId: string): boolean;

  /**
   * Login with username and password
   */
  login(
    connectionId: string,
    username: string,
    password: string,
    securityToken?: string,
    loginUrl?: string,
  ): Promise<jsforce.UserInfo>;

  /**
   * Query Salesforce using SOQL
   */
  query<T extends Record<string, unknown> = Record<string, unknown>>(
    connectionId: string,
    soql: string,
  ): Promise<jsforce.QueryResult<T>>;

  /**
   * Query all records (handles pagination automatically)
   */
  queryAll<T extends Record<string, unknown> = Record<string, unknown>>(
    connectionId: string,
    soql: string,
  ): Promise<T[]>;

  /**
   * Describe an SObject
   */
  describe(
    connectionId: string,
    sobjectType: string,
  ): Promise<jsforce.DescribeSObjectResult>;

  /**
   * Get all available SObjects
   */
  getGlobalDescribe(
    connectionId: string,
  ): Promise<jsforce.DescribeGlobalResult>;

  /**
   * Get a record by ID
   */
  retrieve(
    connectionId: string,
    sobjectType: string,
    recordId: string,
    fields?: string[],
  ): Promise<Record<string, unknown>>;

  /**
   * Bulk query
   */
  bulkQuery<T extends Record<string, unknown> = Record<string, unknown>>(
    connectionId: string,
    sobjectType: string,
    soql: string,
  ): Promise<T[]>;

  /**
   * Get connection info
   */
  getConnectionInfo(connectionId: string): jsforce.UserInfo | null;

  /**
   * Refresh access token
   */
  refreshAccessToken(
    connectionId: string,
    clientSecret: string,
  ): Promise<jsforce.OAuth2>;

  /**
   * Logout
   */
  logout(connectionId: string): Promise<void>;

  /**
   * Clear all connections
   */
  clearAllConnections(): void;
}
