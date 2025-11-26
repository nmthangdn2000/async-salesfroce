import React, { memo } from 'react'
import { Button, Card, Space, Tag, Typography, Badge } from 'antd'
import { ArrowLeftOutlined, SettingOutlined, DatabaseOutlined } from '@ant-design/icons'
import { useNavigate } from '@tanstack/react-router'
import type { Source } from '@/types/source'
import { SourceProvider, SourceStatus } from '@/types/source'

const { Title, Text } = Typography

interface SourceHeaderProps {
  source: Source
  projectName?: string
  isConnected: boolean
  onOpenSettings: () => void
  onOpenTargetSettings: () => void
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

export const SourceHeader = memo<SourceHeaderProps>(({
  source,
  projectName,
  isConnected,
  onOpenSettings,
  onOpenTargetSettings,
}) => {
  const navigate = useNavigate()

  return (
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
            {isConnected && (
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
            {projectName && (
              <Tag>
                Project: {projectName}
              </Tag>
            )}
          </Space>
        </div>
        <Space direction="vertical" align="end" style={{ alignItems: 'flex-end' }}>
          <Space>
            <Button
              type="primary"
              icon={<SettingOutlined />}
              onClick={onOpenSettings}
            >
              {isConnected ? 'Edit Settings' : 'Configure Settings'}
            </Button>
            <Button
              type="default"
              icon={<DatabaseOutlined />}
              onClick={onOpenTargetSettings}
            >
              Target Setting
            </Button>
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
  )
})

SourceHeader.displayName = 'SourceHeader'

