import { memo } from 'react'
import { Card, Space, Empty } from 'antd'
import { DatabaseOutlined } from '@ant-design/icons'
import { ObjectsList } from './ObjectsList'
import { FieldsList } from './FieldsList'
import type { CatalogObject, CatalogField } from '@/services/catalog.service'

interface CatalogSectionProps {
  objects: CatalogObject[]
  objectsTotal: number
  selectedObjectId: string | null
  objectSearch: string
  objectFilterSelected: boolean | undefined
  fields: CatalogField[]
  fieldsTotal: number
  fieldSearch: string
  fieldFilterSelected: boolean | undefined
  fieldChanges: Record<string, boolean>
  isObjectsSyncing: boolean
  isFieldsLoading: boolean
  isFieldsSyncing: boolean
  isSavingFields: boolean
  fieldsError: Error | null
  canSync: boolean
  onObjectSelect: (objectId: string) => void
  onObjectToggle: (objectId: string, isSelected: boolean) => void
  onObjectSearchChange: (search: string) => void
  onObjectFilterChange: (filter: boolean | undefined) => void
  onObjectsSync: () => void
  onFieldChange: (fieldId: string, isSelected: boolean) => void
  onSelectAllFields: () => void
  onDeselectAllFields: () => void
  onSaveFieldChanges: () => void
  onCancelFieldChanges: () => void
  onFieldSearchChange: (search: string) => void
  onFieldFilterChange: (filter: boolean | undefined) => void
  onFieldsSync: () => void
}

export const CatalogSection = memo<CatalogSectionProps>(({
  objects,
  objectsTotal,
  selectedObjectId,
  objectSearch,
  objectFilterSelected,
  fields,
  fieldsTotal,
  fieldSearch,
  fieldFilterSelected,
  fieldChanges,
  isObjectsSyncing,
  isFieldsLoading,
  isFieldsSyncing,
  isSavingFields,
  fieldsError,
  canSync,
  onObjectSelect,
  onObjectToggle,
  onObjectSearchChange,
  onObjectFilterChange,
  onObjectsSync,
  onFieldChange,
  onSelectAllFields,
  onDeselectAllFields,
  onSaveFieldChanges,
  onCancelFieldChanges,
  onFieldSearchChange,
  onFieldFilterChange,
  onFieldsSync,
}) => {
  if (objects.length === 0) {
    return null
  }

  return (
    <Card
      title={
        <Space>
          <DatabaseOutlined />
          <span>Catalog Objects & Fields</span>
        </Space>
      }
      style={{ marginBottom: 24 }}
    >
      <div style={{ display: 'flex', gap: 16, minHeight: '500px' }}>
        <ObjectsList
          objects={objects}
          totalItems={objectsTotal}
          selectedObjectId={selectedObjectId}
          objectSearch={objectSearch}
          objectFilterSelected={objectFilterSelected}
          isSyncing={isObjectsSyncing}
          onObjectSelect={onObjectSelect}
          onObjectToggle={onObjectToggle}
          onSearchChange={onObjectSearchChange}
          onFilterChange={onObjectFilterChange}
          onSync={onObjectsSync}
          canSync={canSync}
        />
        {selectedObjectId ? (
          <FieldsList
            fields={fields}
            totalItems={fieldsTotal}
            fieldSearch={fieldSearch}
            fieldFilterSelected={fieldFilterSelected}
            fieldChanges={fieldChanges}
            isLoading={isFieldsLoading}
            error={fieldsError}
            isSyncing={isFieldsSyncing}
            onFieldChange={onFieldChange}
            onSelectAll={onSelectAllFields}
            onDeselectAll={onDeselectAllFields}
            onSaveChanges={onSaveFieldChanges}
            onCancelChanges={onCancelFieldChanges}
            onSearchChange={onFieldSearchChange}
            onFilterChange={onFieldFilterChange}
            onSync={onFieldsSync}
            canSync={canSync}
            isSaving={isSavingFields}
          />
        ) : (
          <div style={{ flex: '0 0 70%', paddingLeft: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '450px' }}>
            <Empty
              description="Select an object to view its fields"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        )}
      </div>
    </Card>
  )
})

CatalogSection.displayName = 'CatalogSection'

