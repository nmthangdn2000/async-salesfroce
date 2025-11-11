import { Injectable, Logger } from '@nestjs/common';
import * as jsforce from 'jsforce';

import {
  ISalesforceService,
  SalesforceConnectionConfig,
  SalesforceOAuth2Config,
} from './salesforce.interface';

@Injectable()
export class SalesforceService implements ISalesforceService {
  private readonly logger = new Logger(SalesforceService.name);
  private connections: Map<string, jsforce.Connection> = new Map();

  /**
   * Create a Salesforce connection using OAuth2 (for authorization flow)
   */
  createOAuth2Connection(
    connectionId: string,
    config: SalesforceOAuth2Config,
  ): jsforce.Connection {
    const conn = new jsforce.Connection({
      oauth2: {
        loginUrl: config.loginUrl,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        redirectUri: config.redirectUri,
      },
    });

    // Store connection for OAuth2 flow
    this.connections.set(connectionId, conn);

    return conn;
  }

  /**
   * Get OAuth2 authorization URL
   */
  getAuthorizationUrl(connectionId: string, scopes?: string[]): string | null {
    const conn = this.getConnection(connectionId);
    if (!conn || !conn.oauth2) {
      return null;
    }

    const scopeString = scopes ? scopes.join(' ') : 'api id web';
    return conn.oauth2.getAuthorizationUrl({
      scope: scopeString,
    });
  }

  /**
   * Authorize OAuth2 connection with authorization code
   */
  async authorizeOAuth2(
    connectionId: string,
    code: string,
  ): Promise<jsforce.UserInfo> {
    const conn = this.getConnection(connectionId);
    if (!conn || !conn.oauth2) {
      throw new Error(
        `OAuth2 connection ${connectionId} not found or not configured`,
      );
    }

    const userInfo = await conn.authorize(code);

    this.logger.log(
      `Successfully authorized OAuth2 connection ${connectionId}`,
    );
    return userInfo;
  }

  /**
   * Create a Salesforce connection using access token
   */
  createConnection(
    connectionId: string,
    config: SalesforceConnectionConfig,
  ): jsforce.Connection {
    const conn = new jsforce.Connection({
      instanceUrl: config.instanceUrl,
      accessToken: config.accessToken,
      refreshToken: config.refreshToken,
    });

    // Store connection for reuse
    this.connections.set(connectionId, conn);

    return conn;
  }

  /**
   * Get existing connection by ID
   */
  getConnection(connectionId: string): jsforce.Connection | undefined {
    return this.connections.get(connectionId);
  }

  /**
   * Remove connection from cache
   */
  removeConnection(connectionId: string): boolean {
    return this.connections.delete(connectionId);
  }

  /**
   * Login with username and password
   */
  async login(
    connectionId: string,
    username: string,
    password: string,
    securityToken?: string,
    loginUrl: string = 'https://login.salesforce.com',
  ): Promise<jsforce.UserInfo> {
    const conn = new jsforce.Connection({
      loginUrl,
    });

    const userInfo = await conn.login(
      username,
      password + (securityToken || ''),
    );

    // Store connection after successful login
    this.connections.set(connectionId, conn);

    this.logger.log(`Successfully logged in as ${userInfo.id}`);
    return userInfo;
  }

  /**
   * Query Salesforce using SOQL
   */
  async query<T extends Record<string, unknown> = Record<string, unknown>>(
    connectionId: string,
    soql: string,
  ): Promise<jsforce.QueryResult<T>> {
    const conn = this.getConnection(connectionId);
    if (!conn) {
      throw new Error(`Connection ${connectionId} not found`);
    }

    return await conn.query(soql);
  }

  /**
   * Query all records (handles pagination automatically)
   */
  async queryAll<T extends Record<string, unknown> = Record<string, unknown>>(
    connectionId: string,
    soql: string,
  ): Promise<T[]> {
    const conn = this.getConnection(connectionId);
    if (!conn) {
      throw new Error(`Connection ${connectionId} not found`);
    }

    const results: T[] = [];
    let queryResult = await conn.query(soql);

    results.push(...(queryResult.records as T[]));

    while (!queryResult.done && queryResult.nextRecordsUrl) {
      queryResult = await conn.queryMore(queryResult.nextRecordsUrl);

      results.push(...(queryResult.records as T[]));
    }

    return results;
  }

  /**
   * Describe an SObject
   */
  async describe(
    connectionId: string,
    sobjectType: string,
  ): Promise<jsforce.DescribeSObjectResult> {
    const conn = this.getConnection(connectionId);
    if (!conn) {
      throw new Error(`Connection ${connectionId} not found`);
    }

    return await conn.sobject(sobjectType).describe();
  }

  /**
   * Get all available SObjects
   */
  async getGlobalDescribe(
    connectionId: string,
  ): Promise<jsforce.DescribeGlobalResult> {
    const conn = this.getConnection(connectionId);
    if (!conn) {
      throw new Error(`Connection ${connectionId} not found`);
    }

    return await conn.describeGlobal();
  }

  /**
   * Get a record by ID
   */
  async retrieve(
    connectionId: string,
    sobjectType: string,
    recordId: string,
    fields?: string[],
  ): Promise<Record<string, unknown>> {
    const conn = this.getConnection(connectionId);
    if (!conn) {
      throw new Error(`Connection ${connectionId} not found`);
    }

    if (fields && fields.length > 0) {
      return await conn.sobject(sobjectType).retrieve(recordId, { fields });
    }

    return await conn.sobject(sobjectType).retrieve(recordId);
  }

  /**
   * Bulk query
   */
  async bulkQuery<T extends Record<string, unknown> = Record<string, unknown>>(
    connectionId: string,
    sobjectType: string,
    soql: string,
  ): Promise<T[]> {
    const conn = this.getConnection(connectionId);
    if (!conn) {
      throw new Error(`Connection ${connectionId} not found`);
    }

    const job = conn.bulk.createJob(sobjectType, 'query');
    const batch = job.createBatch();
    batch.execute(soql);
    await batch.on('queue', () => {
      batch.poll(10000, 2000);
    });

    return new Promise<T[]>((resolve, reject) => {
      batch.on('response', (results: unknown[]) => {
        void job.close();
        resolve(results as T[]);
      });

      batch.on('error', (error: Error) => {
        void job.close();
        reject(error);
      });
    });
  }

  /**
   * Get connection info
   */
  getConnectionInfo(connectionId: string): jsforce.UserInfo | null {
    const conn = this.getConnection(connectionId);
    if (!conn) {
      throw new Error(`Connection ${connectionId} not found`);
    }

    return conn.userInfo || null;
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(
    connectionId: string,
    clientSecret: string,
  ): Promise<jsforce.OAuth2> {
    const conn = this.getConnection(connectionId);
    if (!conn) {
      throw new Error(`Connection ${connectionId} not found`);
    }

    if (!conn.oauth2) {
      throw new Error('OAuth2 not configured for this connection');
    }

    await conn.oauth2.refreshToken(clientSecret);
    return conn.oauth2;
  }

  /**
   * Logout
   */
  async logout(connectionId: string): Promise<void> {
    const conn = this.getConnection(connectionId);
    if (conn) {
      await conn.logout();
      this.removeConnection(connectionId);
    }
  }

  /**
   * Clear all connections
   */
  clearAllConnections(): void {
    this.connections.clear();
  }
}
