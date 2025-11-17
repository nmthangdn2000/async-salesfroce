export enum AuthType {
  OAUTH2 = 'oauth2',
  API_KEY = 'api_key',
  BASIC = 'basic',
}

export interface SourceSetting {
  id: string
  sourceId: string
  instanceUrl: string
  authType: AuthType
  scopes?: string[]
  clientId?: string
  clientSecret?: string // Masked secret (e.g., "ABC**")
  refreshToken?: string
  createdAt: string
  updatedAt: string
}

export interface CreateSourceSettingRequest {
  sourceId: string
  instanceUrl: string
  authType: AuthType
  scopes?: string[]
  clientId?: string
  clientSecret?: string
  refreshToken?: string
}

export interface UpdateSourceSettingRequest {
  instanceUrl?: string
  authType?: AuthType
  scopes?: string[]
  clientId?: string
  clientSecret?: string
  refreshToken?: string
}

