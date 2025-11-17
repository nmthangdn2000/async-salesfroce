import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Button,
  Card,
  Space,
  Tag,
  Empty,
  Spin,
  Typography,
  Drawer,
  Form,
  Input,
  Select,
  message,
  Alert,
  Divider,
  Badge,
} from 'antd'
import { ArrowLeftOutlined, SettingOutlined, CopyOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { sourceApi } from '@/services/source.service'
import { projectApi } from '@/services/project.service'
import { sourceSettingApi } from '@/services/source-setting.service'
import {
  SourceProvider,
  SourceStatus,
} from '@/types/source'
import { AuthType } from '@/types/source-setting'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const { Title, Text } = Typography

export const Route = createFileRoute('/sources/$id')({
  component: SourceDetailPage,
})

function SourceDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [isSettingDrawerOpen, setIsSettingDrawerOpen] = useState(false)
  const [isOAuthDrawerOpen, setIsOAuthDrawerOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [showManualSetup, setShowManualSetup] = useState(false)
  const queryClient = useQueryClient()

  // Fetch source details
  const { data: source, isLoading: sourceLoading } = useQuery({
    queryKey: ['sources', id],
    queryFn: () => sourceApi.getById(id),
    enabled: !!id,
  })

  // Fetch project details
  const { data: projectsData } = useQuery({
    queryKey: ['projects', 'all'],
    queryFn: () =>
      projectApi.getAll({
        page: 1,
        take: 1000,
      }),
  })

  // Fetch source setting
  const { data: sourceSetting } = useQuery({
    queryKey: ['source-settings', id],
    queryFn: () => sourceSettingApi.getBySourceId(id),
    enabled: !!id,
    retry: false,
  })

  const project = projectsData?.items.find((p) => p.id === source?.projectId)

  // Create/Update mutation
  const saveSettingMutation = useMutation({
    mutationFn: async (values: {
      instanceUrl: string
      authType: AuthType
      scopes?: string[]
      clientId?: string
      clientSecret?: string
      refreshToken?: string
    }) => {
      if (sourceSetting) {
        return sourceSettingApi.update(sourceSetting.id, values)
      } else {
        return sourceSettingApi.create({
          sourceId: id,
          ...values,
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['source-settings', id] })
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to save source setting')
    },
  })

  // Listen for OAuth callback messages from popup window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      const allowedOrigin = window.location.origin
      if (event.origin !== allowedOrigin) {
        return
      }

      // Check if message is from OAuth callback
      if (event.data?.type === 'oauth-callback') {
        const { success, error: errorMessage, sourceId: callbackSourceId } = event.data

        // Only handle if sourceId matches current source
        if (callbackSourceId && callbackSourceId !== id) {
          return
        }

        if (success) {
          message.success('Successfully connected to Salesforce!')
          // Refresh source settings
          queryClient.invalidateQueries({ queryKey: ['source-settings', id] })
          setIsOAuthDrawerOpen(false)
        } else {
          message.error(
            errorMessage || 'Failed to connect to Salesforce. Please try again.'
          )
        }
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [id, queryClient])

  // Generate callback URL from API base URL
  const getCallbackUrl = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
    // Remove /api suffix if present, then add oauth callback route
    const baseUrl = apiBaseUrl.replace(/\/api$/, '')
    return `${baseUrl}/api/auth/oauth/callback`
  }

  const handleAuthenticate = async () => {
    try {
      // Check if source setting exists
      if (!sourceSetting) {
        message.error('Please configure settings first')
        return
      }

      // Call backend API to get authorization URL and open in popup window
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
      const authUrl = `${apiBaseUrl}/auth/oauth/authenticate?sourceId=${id}`
      
      // Calculate center position for popup
      const width = 600
      const height = 700
      const left = (window.screen.width - width) / 2
      const top = (window.screen.height - height) / 2
      
      // Open in popup window (similar to Google OAuth)
      // Remove noopener to allow window.close() to work
      const popup = window.open(
        authUrl,
        'oauth_popup',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
      )
      
      // Store reference to popup window for potential future use
      if (popup) {
        // Check if popup is closed periodically
        const checkPopup = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopup)
            // Refresh data when popup closes
            queryClient.invalidateQueries({ queryKey: ['source-settings', id] })
          }
        }, 500)
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to authenticate')
    }
  }

  const handleCopyCallbackUrl = async () => {
    try {
      const callbackUrl = getCallbackUrl()
      await navigator.clipboard.writeText(callbackUrl)
      setIsCopied(true)
      message.success('Callback URL copied to clipboard!')
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (error) {
      message.error('Failed to copy URL')
    }
  }

  const handleOpenSettingModal = () => {
    if (sourceSetting) {
      form.setFieldsValue({
        instanceUrl: sourceSetting.instanceUrl,
        authType: sourceSetting.authType,
        scopes: sourceSetting.scopes?.join(', ') || 'api, refresh_token, offline_access',
        clientId: sourceSetting.clientId || '',
        refreshToken: sourceSetting.refreshToken || '',
        clientSecret: '', // Don't show secrets in form
      })
      setShowManualSetup(!!sourceSetting.refreshToken)
    } else {
      form.setFieldsValue({
        authType: AuthType.OAUTH2,
        scopes: 'api, refresh_token, offline_access',
      })
      setShowManualSetup(false)
    }
    setIsSettingDrawerOpen(true)
  }

  const handleSaveSetting = async (values: {
    instanceUrl: string
    authType: AuthType
    scopes?: string
    clientId?: string
    clientSecret?: string
    refreshToken?: string
  }) => {
    const scopesArray = values.scopes
      ? values.scopes.split(',').map((s: string) => s.trim()).filter(Boolean)
      : undefined

    // Prepare update data - don't send clientSecret if it's empty
    const updateData: any = {
      instanceUrl: values.instanceUrl,
      authType: values.authType,
      scopes: scopesArray,
      clientId: values.clientId,
      refreshToken: values.refreshToken,
    }

    // Only include clientSecret if it has a value (non-empty string)
    if (values.clientSecret && values.clientSecret.trim() !== '') {
      updateData.clientSecret = values.clientSecret
    }

    try {
      await saveSettingMutation.mutateAsync(updateData)
      message.success(
        sourceSetting
          ? 'Source setting updated successfully'
          : 'Source setting created successfully',
      )
      setIsSettingDrawerOpen(false)
      form.resetFields()
      setShowManualSetup(false)
    } catch (error) {
      // Error is already handled in mutation onError
    }
  }

  const getProviderColor = (provider: SourceProvider) => {
    switch (provider) {
      case SourceProvider.SALESFORCE:
        return 'blue'
      case SourceProvider.HUBSPOT:
        return 'orange'
      case SourceProvider.CUSTOM:
        return 'green'
      default:
        return 'default'
    }
  }

  const getStatusColor = (status: SourceStatus) => {
    switch (status) {
      case SourceStatus.ACTIVE:
        return 'green'
      case SourceStatus.DISABLED:
        return 'red'
      default:
        return 'default'
    }
  }

  if (sourceLoading) {
    return (
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!source) {
    return (
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
        <Card>
          <Empty
            description="Source not found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Source Header */}
      <Card style={{ marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flex: 1 }}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate({ to: '/sources' })}
              style={{ marginBottom: 16 }}
            >
              Back to Sources
            </Button>
            <Space align="center" style={{ marginBottom: 8 }}>
              <Title level={2} style={{ margin: 0 }}>
                {source.name}
              </Title>
              {sourceSetting?.refreshToken && (
                <Badge 
                  status="success" 
                  text={<Text type="success" strong>Connected</Text>}
                />
              )}
            </Space>
            <Space wrap>
              <Tag color={getProviderColor(source.provider)}>
                {source.provider.toUpperCase()}
              </Tag>
              <Tag>{source.environment.toUpperCase()}</Tag>
              <Tag color={getStatusColor(source.status)}>
                {source.status.toUpperCase()}
              </Tag>
              {project && (
                <Tag>
                  Project: {project.name}
                </Tag>
              )}
            </Space>
          </div>
          <Space direction="vertical" align="end" style={{ alignItems: 'flex-end' }}>
            <Space>
              <Button
                type="primary"
                icon={<SettingOutlined />}
                onClick={handleOpenSettingModal}
              >
                {sourceSetting ? 'Edit Settings' : 'Configure Settings'}
              </Button>
              {sourceSetting && (
                <Button
                  type="default"
                  onClick={() => {
                    // Load current refresh token if available
                    if (sourceSetting.refreshToken) {
                      form.setFieldsValue({
                        refreshToken: sourceSetting.refreshToken,
                      })
                    }
                    setIsOAuthDrawerOpen(true)
                  }}
                >
                  Connect to Salesforce
                </Button>
              )}
            </Space>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Created: {new Date(source.createdAt).toLocaleDateString()} | 
                Updated: {new Date(source.updatedAt).toLocaleDateString()}
              </Text>
            </div>
          </Space>
        </div>
      </Card>

      {/* Source Details */}

      {/* Source Setting Drawer */}
      <Drawer
        title={sourceSetting ? 'Edit Source Settings' : 'Configure Source Settings'}
        placement="right"
        onClose={() => {
          setIsSettingDrawerOpen(false)
          form.resetFields()
          setShowManualSetup(false)
        }}
        open={isSettingDrawerOpen}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveSetting}
          autoComplete="off"
        >
          <Form.Item
            label="Instance URL"
            name="instanceUrl"
            rules={[
              { required: true, message: 'Please enter instance URL' },
              { type: 'url', message: 'Please enter a valid URL' },
            ]}
          >
            <Input placeholder="https://myinstance.salesforce.com" />
          </Form.Item>

          <Form.Item
            label="Authentication Type"
            name="authType"
            rules={[{ required: true, message: 'Please select auth type' }]}
          >
            <Select>
              {Object.values(AuthType).map((authType) => (
                <Select.Option key={authType} value={authType}>
                  {authType.toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Callback URL"
            tooltip="Copy this URL and add it to your Salesforce Connected App's Callback URLs"
            extra={
              <Text type="secondary" style={{ fontSize: 12 }}>
                Add this URL to Salesforce: Setup → App Manager → Your App → OAuth Settings → Callback URLs
              </Text>
            }
          >
            <Space.Compact style={{ width: '100%' }}>
              <Input
                readOnly
                value={getCallbackUrl()}
                style={{ fontFamily: 'monospace', fontSize: 12 }}
              />
              <Button
                icon={isCopied ? <CheckOutlined /> : <CopyOutlined />}
                onClick={handleCopyCallbackUrl}
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </Button>
            </Space.Compact>
          </Form.Item>

          <Form.Item
            label="Scopes (comma-separated)"
            name="scopes"
            tooltip="Enter OAuth scopes separated by commas, e.g., api, refresh_token"
            initialValue="api, refresh_token, offline_access"
          >
            <Input placeholder="api, refresh_token, offline_access" />
          </Form.Item>

          <Form.Item
            label="Client ID"
            name="clientId"
            tooltip="Consumer Key from Salesforce Connected App"
          >
            <Input placeholder="3MVG9..." />
          </Form.Item>

          <Form.Item
            label="Client Secret"
            name="clientSecret"
            tooltip="Consumer Secret from Salesforce Connected App"
            extra={
              sourceSetting?.clientSecret ? (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Secret already saved (masked as: {sourceSetting.clientSecret}). Leave empty to keep existing secret, or enter new secret to update.
                </Text>
              ) : null
            }
          >
            <Space.Compact style={{ width: '100%' }}>
              {sourceSetting?.clientSecret && (
                <Input
                  readOnly
                  value={sourceSetting.clientSecret}
                  style={{
                    width: '30%',
                    fontFamily: 'monospace',
                    backgroundColor: '#f5f5f5',
                    cursor: 'default',
                  }}
                  disabled
                />
              )}
              <Input.Password
                style={sourceSetting?.clientSecret ? { width: '70%' } : { width: '100%' }}
                placeholder={
                  sourceSetting?.clientSecret
                    ? "Enter new secret to update, or leave empty to keep existing"
                    : "Enter client secret"
                }
              />
            </Space.Compact>
          </Form.Item>

          {showManualSetup && (
            <Form.Item
              label="Refresh Token (Optional)"
              name="refreshToken"
              tooltip="Manually enter refresh token if OAuth flow setup fails"
            >
              <Input placeholder="Enter refresh token manually if needed" />
            </Form.Item>
          )}
        </Form>

        {/* Footer Actions */}
        <Divider style={{ margin: '24px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button
            onClick={() => {
              setIsSettingDrawerOpen(false)
              form.resetFields()
              setShowManualSetup(false)
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={saveSettingMutation.isPending}
          >
            Save Settings
          </Button>
        </div>
      </Drawer>

      {/* OAuth Authentication Drawer */}
      <Drawer
        title="OAuth Authentication"
        placement="right"
        onClose={() => {
          setIsOAuthDrawerOpen(false)
          setShowManualSetup(false)
        }}
        open={isOAuthDrawerOpen}
        width={500}
      >
        <Alert
          message="Configure your settings first, then choose an authentication method"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
        
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Title level={5} style={{ marginBottom: 12 }}>
              Automatic Authentication
            </Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              Authenticate your Salesforce account automatically using OAuth 2.0 flow
            </Text>
            <Button
              type="primary"
              block
              size="large"
              disabled={showManualSetup}
              onClick={handleAuthenticate}
              loading={saveSettingMutation.isPending}
            >
              Authenticate your Salesforce account
            </Button>
          </div>

          <Divider>OR</Divider>

          <div>
            <Title level={5} style={{ marginBottom: 12 }}>
              Manual Setup
            </Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              Enter refresh token manually if OAuth flow setup fails
            </Text>
            <Button
              type={showManualSetup ? 'primary' : 'default'}
              block
              size="large"
              icon={showManualSetup ? <CloseOutlined /> : null}
              onClick={() => {
                setShowManualSetup(!showManualSetup)
                if (!showManualSetup) {
                  // Get refresh token from form if available
                  const currentValues = form.getFieldsValue()
                  if (!currentValues.refreshToken) {
                    form.setFieldsValue({ refreshToken: '' })
                  }
                }
              }}
            >
              {showManualSetup ? 'Cancel Manual Setup' : 'Set up manually'}
            </Button>
          </div>

          {showManualSetup && (
            <div style={{ marginTop: 16 }}>
              <Form.Item
                label="Refresh Token"
                name="refreshToken"
                tooltip="Manually enter refresh token if OAuth flow setup fails"
                rules={[{ required: true, message: 'Please enter refresh token' }]}
              >
                <Input.TextArea
                  placeholder="Enter refresh token manually if needed"
                  rows={4}
                />
              </Form.Item>
              <Button
                type="primary"
                block
                onClick={async () => {
                  try {
                    const formValues = form.getFieldsValue()
                    if (!formValues.refreshToken) {
                      message.error('Please enter refresh token')
                      return
                    }

                    if (!sourceSetting) {
                      message.error('Please save settings first')
                      return
                    }

                    await saveSettingMutation.mutateAsync({
                      instanceUrl: sourceSetting.instanceUrl,
                      authType: sourceSetting.authType,
                      scopes: sourceSetting.scopes,
                      clientId: sourceSetting.clientId,
                      refreshToken: formValues.refreshToken,
                    })

                    message.success('Refresh token saved successfully')
                    setIsOAuthDrawerOpen(false)
                    queryClient.invalidateQueries({ queryKey: ['source-settings', id] })
                  } catch (error) {
                    // Error is already handled in mutation onError
                  }
                }}
                loading={saveSettingMutation.isPending}
              >
                Save Refresh Token
              </Button>
            </div>
          )}
        </Space>
      </Drawer>
    </div>
  )
}

