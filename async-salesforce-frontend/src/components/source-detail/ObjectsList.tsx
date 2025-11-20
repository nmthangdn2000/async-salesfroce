import React, { memo, useMemo } from 'react'
import { Button, Card, Space, Input, Select, Empty, Typography, Switch } from 'antd'
import { SyncOutlined, SearchOutlined } from '@ant-design/icons'
import type { CatalogObject } from '@/services/catalog.service'

const { Title, Text } = Typography

interface ObjectsListProps {
  objects: CatalogObject[]
  totalItems: number
  selectedObjectId: string | null
  objectSearch: string
  objectFilterSelected: boolean | undefined
  isSyncing: boolean
  onObjectSelect: (objectId: string) => void
  onObjectToggle: (objectId: string, isSelected: boolean) => void
  onSearchChange: (search: string) => void
  onFilterChange: (filter: boolean | undefined) => void
  onSync: () => void
  canSync: boolean
}

export const ObjectsList = memo<ObjectsListProps>(({
  objects,
  totalItems,
  selectedObjectId,
  objectSearch,
  objectFilterSelected,
  isSyncing,
  onObjectSelect,
  onObjectToggle,
  onSearchChange,
  onFilterChange,
  onSync,
  canSync,
}) => {
  const sortedObjects = useMemo(() => {
    return [...objects].sort((a, b) => {
      const nameA = (a.label || a.apiName).toLowerCase()
      const nameB = (b.label || b.apiName).toLowerCase()
      return nameA.localeCompare(nameB)
    })
  }, [objects])

  return (
    <div style={{ flex: '0 0 30%', borderRight: '1px solid #f0f0f0', paddingRight: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>
          Objects ({totalItems})
        </Title>
        {canSync && (
          <Button
            type="default"
            size="small"
            icon={<SyncOutlined />}
            loading={isSyncing}
            onClick={onSync}
          >
            Sync
          </Button>
        )}
      </div>
      <Space style={{ width: '100%', marginBottom: 16 }} size={8}>
        <Input
          placeholder="Search objects..."
          prefix={<SearchOutlined />}
          value={objectSearch}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Filter by selection"
          value={objectFilterSelected === undefined ? 'all' : objectFilterSelected ? 'selected' : 'unselected'}
          onChange={(value) => {
            if (value === 'all') {
              onFilterChange(undefined)
            } else {
              onFilterChange(value === 'selected')
            }
          }}
          style={{ width: 150 }}
        >
          <Select.Option value="all">All Objects</Select.Option>
          <Select.Option value="selected">Selected Only</Select.Option>
          <Select.Option value="unselected">Unselected Only</Select.Option>
        </Select>
      </Space>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {sortedObjects.length === 0 ? (
          <Empty description="No objects found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Space direction="vertical" style={{ width: '100%' }} size={8}>
            {sortedObjects.map((obj) => (
              <Card
                key={obj.id}
                size="small"
                hoverable
                onClick={() => onObjectSelect(obj.id)}
                style={{
                  cursor: 'pointer',
                  border: selectedObjectId === obj.id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                  backgroundColor: selectedObjectId === obj.id ? '#e6f7ff' : '#fff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        <Switch
                          checked={obj.isSelected}
                          size="small"
                          onChange={(checked) => {
                            onObjectToggle(obj.id, checked)
                          }}
                        />
                      </div>
                      <Text strong style={{ flex: 1 }}>
                        {obj.label || obj.apiName}
                      </Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {obj.apiName}
                    </Text>
                  </div>
                </div>
              </Card>
            ))}
          </Space>
        )}
      </div>
    </div>
  )
})

ObjectsList.displayName = 'ObjectsList'

