import React, { memo, useState, useEffect } from 'react'
import { Drawer, Alert, Space, Button, Form, Input, Typography, Divider, message } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import type { SourceSetting } from '@/types/source-setting'

const { Title, Text } = Typography

interface OAuthDrawerProps {
  open: boolean
  sourceSetting: SourceSetting | undefined
  isSaving: boolean
  onClose: () => void
  onAuthenticate: () => void
  onSaveRefreshToken: (refreshToken: string) => Promise<void>
}

export const OAuthDrawer = memo<OAuthDrawerProps>(({
  open,
  sourceSetting,
  isSaving,
  onClose,
  onAuthenticate,
  onSaveRefreshToken,
}) => {
  const [showManualSetup, setShowManualSetup] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    if (open && sourceSetting?.refreshToken) {
      form.setFieldsValue({
        refreshToken: sourceSetting.refreshToken,
      })
    } else if (open) {
      form.setFieldsValue({
        refreshToken: '',
      })
    }
  }, [open, sourceSetting, form])

  const handleClose = () => {
    setShowManualSetup(false)
    form.resetFields()
    onClose()
  }

  const handleSaveRefreshToken = async () => {
    try {
      const formValues = await form.validateFields()
      if (!formValues.refreshToken) {
        message.error('Please enter refresh token')
        return
      }

      if (!sourceSetting) {
        message.error('Please save settings first')
        return
      }

      await onSaveRefreshToken(formValues.refreshToken)
      message.success('Refresh token saved successfully')
      handleClose()
    } catch (error) {
      // Error is already handled
    }
  }

  return (
    <Drawer
      title="OAuth Authentication"
      placement="right"
      onClose={handleClose}
      open={open}
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
            onClick={onAuthenticate}
            loading={isSaving}
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
              onClick={handleSaveRefreshToken}
              loading={isSaving}
            >
              Save Refresh Token
            </Button>
          </div>
        )}
      </Space>
    </Drawer>
  )
})

OAuthDrawer.displayName = 'OAuthDrawer'

