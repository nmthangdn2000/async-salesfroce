import React, { memo, useEffect, useState } from 'react'
import { Drawer, Form, Input, InputNumber, Switch, Select, Button, Space, Typography, Divider, Tabs } from 'antd'
import { DatabaseOutlined } from '@ant-design/icons'
import { TargetKind } from '@/types/target'
import type { Target } from '@/types/target'

const { Text } = Typography

interface TargetSettingDrawerProps {
  open: boolean
  projectId: string
  target: Target | undefined
  targets: Target[]
  isSaving: boolean
  onClose: () => void
  onSave: (values: {
    targetId?: string
    kind?: TargetKind
    name?: string
    host?: string
    port?: number
    database?: string
    username?: string
    schema?: string
    ssl: boolean
    sslMode?: string
    connectionString?: string
    secretsRef?: string
  }) => Promise<any>
}

export const TargetSettingDrawer = memo<TargetSettingDrawerProps>(({
  open,
  projectId,
  target,
  targets,
  isSaving,
  onClose,
  onSave,
}) => {
  const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState<'host' | 'url'>('host')

  useEffect(() => {
    if (open) {
      if (target) {
        form.setFieldsValue({
          targetId: target.id,
          targetKind: target.kind,
          name: target.name,
          host: target.host || '',
          port: target.port || undefined,
          database: target.database || '',
          username: target.username || '',
          schema: target.schema || '',
          ssl: target.ssl ?? false,
          sslMode: target.sslMode || '',
          connectionString: target.connectionString || '',
        })
      } else {
        form.setFieldsValue({
          ssl: false,
        })
      }
    }
  }, [open, target, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      const updateData: any = {
        targetId: values.targetId,
        kind: values.targetKind,
        name: values.name,
        host: values.host || undefined,
        port: values.port || undefined,
        database: values.database || undefined,
        username: values.username || undefined,
        schema: values.schema || undefined,
        ssl: values.ssl ?? false,
        sslMode: values.sslMode || undefined,
        connectionString: values.connectionString || undefined,
        secretsRef: values.targetId ? `target-secret-${values.targetId}` : undefined,
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

  const selectedTarget = Form.useWatch('targetId', form)
  const targetKind = targets.find(t => t.id === selectedTarget)?.kind

  return (
    <Drawer
      title={
        <Space>
          <DatabaseOutlined />
          <span>{target ? 'Edit Target' : 'Create Target'}</span>
        </Space>
      }
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
        {targets.length > 0 && (
          <Form.Item
            label="Target"
            name="targetId"
            tooltip="Select existing target or create new one below"
          >
            <Select 
              placeholder="Select a target or create new" 
              showSearch
              allowClear
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={targets.map((t) => ({
                label: `${t.name} (${t.kind.toUpperCase()})`,
                value: t.id,
              }))}
            />
          </Form.Item>
        )}

        {!target && (
          <>
            <Form.Item
              label="Target Name"
              name="name"
              rules={[{ required: !target, message: 'Please enter target name' }]}
            >
              <Input placeholder="Enter target name" />
            </Form.Item>

            <Form.Item
              label="Target Kind"
              name="targetKind"
              rules={[{ required: !target, message: 'Please select target kind' }]}
              tooltip="Select target database type"
            >
              <Select placeholder="Select target kind">
                {Object.values(TargetKind).map((kind) => (
                  <Select.Option key={kind} value={kind}>
                    {kind.toUpperCase()}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </>
        )}

        <Divider>Database Connection</Divider>

        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as 'host' | 'url')}
          items={[
            {
              key: 'host',
              label: 'Host',
              children: (
                <div>
                  <Form.Item
                    label="Host"
                    name="host"
                    tooltip="Database server hostname or IP address"
                  >
                    <Input placeholder="localhost or db.example.com" />
                  </Form.Item>

                  <Form.Item
                    label="Port"
                    name="port"
                    tooltip="Database server port number"
                  >
                    <InputNumber
                      placeholder={targetKind === TargetKind.POSTGRES ? '5432' : targetKind === TargetKind.MYSQL ? '3306' : targetKind === TargetKind.SQLSERVER ? '1433' : targetKind === TargetKind.MONGODB ? '27017' : '5432'}
                      min={1}
                      max={65535}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Database"
                    name="database"
                    tooltip="Database name"
                  >
                    <Input placeholder="database_name" />
                  </Form.Item>

                  <Form.Item
                    label="Username"
                    name="username"
                    tooltip="Database username"
                  >
                    <Input placeholder="username" />
                  </Form.Item>

                  {(targetKind === TargetKind.POSTGRES || targetKind === TargetKind.SQLSERVER) && (
                    <Form.Item
                      label="Schema"
                      name="schema"
                      tooltip="Database schema (for PostgreSQL or SQL Server)"
                    >
                      <Input placeholder="public" />
                    </Form.Item>
                  )}

                  <Form.Item
                    label="SSL"
                    name="ssl"
                    valuePropName="checked"
                    tooltip="Enable SSL connection"
                  >
                    <Switch />
                  </Form.Item>

                  {targetKind === TargetKind.POSTGRES && (
                    <Form.Item
                      label="SSL Mode"
                      name="sslMode"
                      tooltip="PostgreSQL SSL mode (require, prefer, allow, disable, verify-ca, verify-full)"
                    >
                      <Select placeholder="Select SSL mode">
                        <Select.Option value="disable">Disable</Select.Option>
                        <Select.Option value="allow">Allow</Select.Option>
                        <Select.Option value="prefer">Prefer</Select.Option>
                        <Select.Option value="require">Require</Select.Option>
                        <Select.Option value="verify-ca">Verify CA</Select.Option>
                        <Select.Option value="verify-full">Verify Full</Select.Option>
                      </Select>
                    </Form.Item>
                  )}
                </div>
              ),
            },
            {
              key: 'url',
              label: 'URL',
              children: (
                <div>
                  <Form.Item
                    label="Connection String"
                    name="connectionString"
                    tooltip="Full connection string (for BigQuery, Snowflake, etc.)"
                    extra={
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Use this for databases that require a full connection string instead of individual fields.
                        <br />
                        Examples:
                        <br />
                        • PostgreSQL: postgresql://user:password@host:port/database
                        <br />
                        • MySQL: mysql://user:password@host:port/database
                        <br />
                        • BigQuery: bigquery://project.dataset
                        <br />
                        • Snowflake: jdbc:snowflake://account.snowflakecomputing.com/?db=database&schema=schema
                      </Text>
                    }
                  >
                    <Input.TextArea
                      placeholder="postgresql://user:password@host:port/database"
                      rows={5}
                    />
                  </Form.Item>
                </div>
              ),
            },
          ]}
        />
      </Form>

      <Divider style={{ margin: '24px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={isSaving}
        >
          Save Target Connection
        </Button>
      </div>
    </Drawer>
  )
})

TargetSettingDrawer.displayName = 'TargetSettingDrawer'

