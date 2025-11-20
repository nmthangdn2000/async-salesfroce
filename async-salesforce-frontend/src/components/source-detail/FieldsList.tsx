import React, { memo, useMemo } from 'react'
import { Button, Card, Space, Input, Select, Empty, Typography, Tag, Spin, Switch } from 'antd'
import { SyncOutlined, SearchOutlined } from '@ant-design/icons'
import type { CatalogField } from '@/services/catalog.service'

const { Title, Text } = Typography

interface FieldsListProps {
  fields: CatalogField[]
  totalItems: number
  fieldSearch: string
  fieldFilterSelected: boolean | undefined
  fieldChanges: Record<string, boolean>
  isLoading: boolean
  error: Error | null
  isSyncing: boolean
  onFieldChange: (fieldId: string, isSelected: boolean) => void
  onSelectAll: () => void
  onDeselectAll: () => void
  onSaveChanges: () => void
  onCancelChanges: () => void
  onSearchChange: (search: string) => void
  onFilterChange: (filter: boolean | undefined) => void
  onSync: () => void
  canSync: boolean
  isSaving: boolean
}

export const FieldsList = memo<FieldsListProps>(({
  fields,
  totalItems,
  fieldSearch,
  fieldFilterSelected,
  fieldChanges,
  isLoading,
  error,
  isSyncing,
  onFieldChange,
  onSelectAll,
  onDeselectAll,
  onSaveChanges,
  onCancelChanges,
  onSearchChange,
  onFilterChange,
  onSync,
  canSync,
  isSaving,
}) => {
  const hasChanges = useMemo(() => Object.keys(fieldChanges).length > 0, [fieldChanges])

  const getCurrentState = useMemo(() => {
    return (fieldId: string, defaultSelected: boolean) => {
      return fieldChanges[fieldId] !== undefined ? fieldChanges[fieldId] : defaultSelected
    }
  }, [fieldChanges])

  return (
    <div style={{ flex: '0 0 70%', paddingLeft: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>
          Fields ({totalItems})
        </Title>
        {canSync && (
          <Button
            type="default"
            size="small"
            icon={<SyncOutlined />}
            loading={isSyncing}
            onClick={onSync}
          >
            Sync Fields
          </Button>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 8 }}>
        <Space style={{ flex: 1 }} size={8}>
          <Input
            placeholder="Search fields..."
            prefix={<SearchOutlined />}
            value={fieldSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            allowClear
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Filter by selection"
            value={fieldFilterSelected === undefined ? 'all' : fieldFilterSelected ? 'selected' : 'unselected'}
            onChange={(value) => {
              if (value === 'all') {
                onFilterChange(undefined)
              } else {
                onFilterChange(value === 'selected')
              }
            }}
            style={{ width: 150 }}
          >
            <Select.Option value="all">All Fields</Select.Option>
            <Select.Option value="selected">Selected Only</Select.Option>
            <Select.Option value="unselected">Unselected Only</Select.Option>
          </Select>
        </Space>
        <Space size={8}>
          <Button
            size="small"
            onClick={onSelectAll}
            disabled={fields.length === 0}
          >
            Select All
          </Button>
          <Button
            size="small"
            onClick={onDeselectAll}
            disabled={fields.length === 0}
          >
            Deselect All
          </Button>
          {hasChanges && (
            <>
              <Button
                size="small"
                type="primary"
                onClick={onSaveChanges}
                loading={isSaving}
              >
                Save Changes
              </Button>
              <Button
                size="small"
                onClick={onCancelChanges}
              >
                Cancel
              </Button>
            </>
          )}
        </Space>
      </div>
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Spin />
        </div>
      ) : error ? (
        <Empty
          description={
            <div>
              <Text type="danger">Error loading fields: {error.message}</Text>
            </div>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginTop: 40 }}
        />
      ) : fields.length > 0 ? (
        <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
          <Space direction="vertical" style={{ width: '100%' }} size={8}>
            {fields.map((field) => {
              const currentState = getCurrentState(field.id, field.isSelected)
              const hasChange = fieldChanges[field.id] !== undefined
              return (
                <Card
                  key={field.id}
                  size="small"
                  style={{
                    border: hasChange ? '1px solid #1890ff' : currentState ? '1px solid #52c41a' : '1px solid #d9d9d9',
                    backgroundColor: hasChange ? '#e6f7ff' : currentState ? '#f6ffed' : '#fff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Switch
                          checked={currentState}
                          size="small"
                          disabled={field.isRequired}
                          onChange={(checked) => {
                            onFieldChange(field.id, checked)
                          }}
                        />
                        <Space>
                          <Text strong>{field.label || field.apiName}</Text>
                          {field.isRequired && (
                            <Tag color="red">
                              Required
                            </Tag>
                          )}
                        </Space>
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {field.apiName} • {field.sfType}
                        {field.length && ` • Length: ${field.length}`}
                        {field.precision && field.scale && ` • Precision: ${field.precision},${field.scale}`}
                      </Text>
                    </div>
                  </div>
                </Card>
              )
            })}
          </Space>
        </div>
      ) : (
        <Empty
          description={
            <div>
              <Text>No fields found for this object</Text>
              <br />
              {canSync && (
                <Button
                  type="link"
                  size="small"
                  onClick={onSync}
                  loading={isSyncing}
                >
                  Sync fields from Salesforce
                </Button>
              )}
            </div>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginTop: 40 }}
        />
      )}
    </div>
  )
})

FieldsList.displayName = 'FieldsList'

