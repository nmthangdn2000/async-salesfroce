import React, { memo, useEffect } from 'react'
import { Drawer, Form, Input, Select, Button, Space, Typography, Divider, Badge } from 'antd'
import { CopyOutlined, CheckOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { AuthType } from '@/types/source-setting'
import type { SourceSetting } from '@/types/source-setting'

const { Text } = Typography

interface SettingsDrawerProps {
  open: boolean
  sourceSetting: SourceSetting | undefined
  isCopied: boolean
  isSaving: boolean
  isConnected: boolean
  onClose: () => void
  onSave: (values: {
    instanceUrl: string
    authType: AuthType
    scopes?: string[]
    clientId?: string
    clientSecret?: string
    refreshToken?: string
  }) => Promise<void>
  onCopyCallbackUrl: () => void
  getCallbackUrl: () => string
  onOpenOAuth: () => void
}

export const SettingsDrawer = memo<SettingsDrawerProps>(({
  open,
  sourceSetting,
  isCopied,
  isSaving,
  isConnected,
  onClose,
  onSave,
  onCopyCallbackUrl,
  getCallbackUrl,
  onOpenOAuth,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) {
      if (sourceSetting) {
        form.setFieldsValue({
          instanceUrl: sourceSetting.instanceUrl,
          authType: sourceSetting.authType,
          scopes: sourceSetting.scopes?.join(', ') || 'api, refresh_token, offline_access',
          clientId: sourceSetting.clientId || '',
          refreshToken: sourceSetting.refreshToken || '',
          clientSecret: '', // Don't show secrets in form
        })
      } else {
        form.setFieldsValue({
          authType: AuthType.OAUTH2,
          scopes: 'api, refresh_token, offline_access',
        })
      }
    }
  }, [open, sourceSetting, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const scopesArray = values.scopes
        ? values.scopes.split(',').map((s: string) => s.trim()).filter(Boolean)
        : undefined

      const updateData: any = {
        instanceUrl: values.instanceUrl,
        authType: values.authType,
        scopes: scopesArray,
        clientId: values.clientId,
        refreshToken: values.refreshToken,
      }

      if (values.clientSecret && values.clientSecret.trim() !== '') {
        updateData.clientSecret = values.clientSecret
      }

      await onSave(updateData)
      form.resetFields()
    } catch (error) {
      // Validation errors are handled by form
    }
  }

  const handleClose = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Drawer
      title={sourceSetting ? 'Edit Source Settings' : 'Configure Source Settings'}
      placement="right"
      onClose={handleClose}
      open={open}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
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
              onClick={onCopyCallbackUrl}
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
      </Form>

      <Divider style={{ margin: '24px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <Button
            type={isConnected ? "primary" : "default"}
            icon={isConnected ? <CheckCircleOutlined /> : null}
            onClick={() => {
              onOpenOAuth()
              handleClose()
            }}
            style={isConnected ? {
              backgroundColor: '#52c41a',
              borderColor: '#52c41a',
            } : {}}
          >
            {isConnected ? 'Connected to Salesforce' : 'Connect to Salesforce'}
          </Button>
        </div>
        <Space>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={isSaving}
          >
            Save Settings
          </Button>
        </Space>
      </div>
    </Drawer>
  )
})

SettingsDrawer.displayName = 'SettingsDrawer'

