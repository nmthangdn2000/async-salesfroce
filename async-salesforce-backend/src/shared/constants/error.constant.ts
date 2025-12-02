export enum ERROR_MESSAGES {
  // 1001 - 1010: Auth
  EmailAlreadyExists = 1001,
  EmailOrPasswordIncorrect = 1002,
  OAuthCallbackFailed = 1003,

  // 1011 - 1020: User
  UserNotFound = 1011,

  // 1021 - 1030: Role
  RoleNotFound = 1021,

  // 1031 - 1040: Permission
  YouDoNotHavePermission = 1031,

  // 1041 - 1050: File
  FileFormatNotSupport = 1041,

  // 1051 - 1060: Project
  ProjectNotFound = 1051,

  // 1061 - 1070: Source
  SourceNotFound = 1061,

  // 1071 - 1080: Project Member
  ProjectMemberNotFound = 1071,
  ProjectMemberAlreadyExists = 1072,

  // 1081 - 1090: Source Setting
  SourceSettingNotFound = 1081,
  SourceSettingAlreadyExists = 1082,

  // 1091 - 1100: Target
  TargetNotFound = 1091,

  // 1101 - 1110: Mapping
  ObjectMappingNotFound = 1101,
  ObjectMappingAlreadyExists = 1102,
  FieldMappingNotFound = 1103,
  FieldMappingAlreadyExists = 1104,
  NoCatalogFieldsFound = 1105,
  AllFieldsAlreadyMapped = 1106,

  // 1201 - 1210: Sync
  SyncJobAlreadyExists = 1201,
  SyncJobNotFound = 1202,
  SyncJobAlreadyRunning = 1203,
  SyncRunNotFound = 1204,
}
