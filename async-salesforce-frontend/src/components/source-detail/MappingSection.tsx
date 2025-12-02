import { memo, useState, useMemo } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
  Tag,
  Empty,
  Typography,
  Tabs,
  Checkbox,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ApiOutlined,
  ImportOutlined,
} from '@ant-design/icons'
import type {
  ObjectMapping,
  FieldMapping,
  CreateObjectMappingRequest,
  CreateFieldMappingRequest,
} from '@/types/mapping'
import { PKStrategy } from '@/types/mapping'
import { mappingApi } from '@/services/mapping.service'
import { catalogApi } from '@/services/catalog.service'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const { Title } = Typography

interface MappingSectionProps {
  sourceId: string
  targetId?: string
}

export const MappingSection = memo<MappingSectionProps>(
  ({ sourceId, targetId }) => {
    const queryClient = useQueryClient()
    const [objectMappingForm] = Form.useForm()
    const [fieldMappingForm] = Form.useForm()
    const [isObjectModalOpen, setIsObjectModalOpen] = useState(false)
    const [isFieldModalOpen, setIsFieldModalOpen] = useState(false)
    const [isImportModalOpen, setIsImportModalOpen] = useState(false)
    const [selectedCatalogFieldIds, setSelectedCatalogFieldIds] = useState<string[]>([])
    const [editingObjectMapping, setEditingObjectMapping] =
      useState<ObjectMapping | null>(null)
    const [editingFieldMapping, setEditingFieldMapping] =
      useState<FieldMapping | null>(null)
    const [selectedObjectMappingId, setSelectedObjectMappingId] = useState<
      string | null
    >(null)
    const [objectSearch, setObjectSearch] = useState('')
    const [fieldSearch, setFieldSearch] = useState('')

    // Fetch object mappings (must be first to use in other queries)
    const { data: objectMappingsData, isLoading: objectMappingsLoading } =
      useQuery({
        queryKey: ['object-mappings', sourceId, targetId, objectSearch],
        queryFn: () =>
          mappingApi.getObjectMappings({
            sourceId,
            targetId,
            search: objectSearch || undefined,
            page: 1,
            take: 100,
          }),
        enabled: !!sourceId,
      })

    // Fetch selected catalog objects for dropdown
    const { data: selectedObjectsData } = useQuery({
      queryKey: ['catalog-objects-selected', sourceId],
      queryFn: () =>
        catalogApi.getObjects({
          sourceId,
          isSelected: true,
          page: 1,
          take: 1000,
        }),
      enabled: !!sourceId && (isObjectModalOpen || isImportModalOpen || isFieldModalOpen),
    })

    // Fetch selected catalog fields for selected object mapping
    const selectedObjectMapping = objectMappingsData?.items.find(
      (om) => om.id === selectedObjectMappingId,
    )
    
    // Find catalog object ID from selected object mapping
    const catalogObjectForMapping = selectedObjectsData?.items.find(
      (obj) => obj.apiName === selectedObjectMapping?.objectApiName,
    )

    const { data: selectedFieldsData } = useQuery({
      queryKey: [
        'catalog-fields-selected',
        catalogObjectForMapping?.id,
        sourceId,
      ],
      queryFn: () => {
        if (!catalogObjectForMapping) {
          return Promise.resolve({ items: [], meta: { totalItems: 0, page: 1, take: 1000, itemCount: 0, totalPages: 0 } })
        }
        return catalogApi.getFields({
          objectId: catalogObjectForMapping.id,
          isSelected: true,
          page: 1,
          take: 1000,
        })
      },
      enabled:
        !!catalogObjectForMapping?.id &&
        !!sourceId &&
        (isFieldModalOpen || isImportModalOpen),
    })

    // Fetch field mappings for selected object mapping
    const { data: fieldMappingsData, isLoading: fieldMappingsLoading } =
      useQuery({
        queryKey: [
          'field-mappings',
          selectedObjectMappingId,
          fieldSearch,
        ],
        queryFn: () =>
          mappingApi.getFieldMappings({
            objectMappingId: selectedObjectMappingId || undefined,
            search: fieldSearch || undefined,
            page: 1,
            take: 100,
          }),
        enabled: !!selectedObjectMappingId,
      })

    // Fetch existing field mappings when modal opens to filter out already mapped fields
    const { data: existingFieldMappingsData, isLoading: existingFieldMappingsLoading } = useQuery({
      queryKey: [
        'field-mappings-for-filter',
        selectedObjectMappingId,
      ],
      queryFn: () =>
        mappingApi.getFieldMappings({
          objectMappingId: selectedObjectMappingId || undefined,
          page: 1,
          take: 1000,
        }),
      enabled: !!selectedObjectMappingId && (isFieldModalOpen || isImportModalOpen),
      staleTime: 0, // Always fetch fresh data when modal opens
    })

    // Get list of already mapped field API names (exclude the one being edited)
    const mappedFieldApiNames = useMemo(() => {
      if (!existingFieldMappingsData?.items) return new Set<string>()
      return new Set(
        existingFieldMappingsData.items
          .filter((fm) => fm.id !== editingFieldMapping?.id) // Exclude current field if editing
          .map((fm) => fm.sfFieldApiName)
      )
    }, [existingFieldMappingsData?.items, editingFieldMapping?.id])

    // Filter out already mapped fields from selectedFieldsData
    const availableFields = useMemo(() => {
      if (!selectedFieldsData?.items) return []
      return selectedFieldsData.items.filter(
        (field) => !mappedFieldApiNames.has(field.apiName)
      )
    }, [selectedFieldsData?.items, mappedFieldApiNames])

    // Object mapping mutations
    const createObjectMappingMutation = useMutation({
      mutationFn: mappingApi.createObjectMapping,
      onSuccess: () => {
        message.success('Object mapping created successfully')
        setIsObjectModalOpen(false)
        objectMappingForm.resetFields()
        queryClient.invalidateQueries({ queryKey: ['object-mappings'] })
      },
      onError: (error: any) => {
        const errorMessage = error?.message || error?.response?.data?.errorMessage || error?.response?.data?.message || 'Failed to create object mapping'
        message.error(errorMessage)
      },
    })

    const updateObjectMappingMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) =>
        mappingApi.updateObjectMapping(id, data),
      onSuccess: () => {
        message.success('Object mapping updated successfully')
        setIsObjectModalOpen(false)
        setEditingObjectMapping(null)
        objectMappingForm.resetFields()
        queryClient.invalidateQueries({ queryKey: ['object-mappings'] })
      },
      onError: (error: any) => {
        const errorMessage = error?.message || error?.response?.data?.errorMessage || error?.response?.data?.message || 'Failed to update object mapping'
        message.error(errorMessage)
      },
    })

    const deleteObjectMappingMutation = useMutation({
      mutationFn: mappingApi.deleteObjectMapping,
      onSuccess: () => {
        message.success('Object mapping deleted successfully')
        if (selectedObjectMappingId) {
          setSelectedObjectMappingId(null)
        }
        queryClient.invalidateQueries({ queryKey: ['object-mappings'] })
        queryClient.invalidateQueries({ queryKey: ['field-mappings'] })
      },
      onError: (error: any) => {
        const errorMessage = error?.message || error?.response?.data?.errorMessage || error?.response?.data?.message || 'Failed to delete object mapping'
        message.error(errorMessage)
      },
    })

    // Field mapping mutations
    const createFieldMappingMutation = useMutation({
      mutationFn: mappingApi.createFieldMapping,
      onSuccess: () => {
        message.success('Field mapping created successfully')
        setIsFieldModalOpen(false)
        fieldMappingForm.resetFields()
        queryClient.invalidateQueries({ queryKey: ['field-mappings'] })
        queryClient.invalidateQueries({ queryKey: ['field-mappings-for-filter'] })
      },
      onError: (error: any) => {
        const errorMessage = error?.message || error?.response?.data?.errorMessage || error?.response?.data?.message || 'Failed to create field mapping'
        message.error(errorMessage)
      },
    })

    const updateFieldMappingMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) =>
        mappingApi.updateFieldMapping(id, data),
      onSuccess: () => {
        message.success('Field mapping updated successfully')
        setIsFieldModalOpen(false)
        setEditingFieldMapping(null)
        fieldMappingForm.resetFields()
        queryClient.invalidateQueries({ queryKey: ['field-mappings'] })
        queryClient.invalidateQueries({ queryKey: ['field-mappings-for-filter'] })
      },
      onError: (error: any) => {
        const errorMessage = error?.message || error?.response?.data?.errorMessage || error?.response?.data?.message || 'Failed to update field mapping'
        message.error(errorMessage)
      },
    })

    const deleteFieldMappingMutation = useMutation({
      mutationFn: mappingApi.deleteFieldMapping,
      onSuccess: () => {
        message.success('Field mapping deleted successfully')
        queryClient.invalidateQueries({ queryKey: ['field-mappings'] })
        queryClient.invalidateQueries({ queryKey: ['field-mappings-for-filter'] })
      },
      onError: (error: any) => {
        const errorMessage = error?.message || error?.response?.data?.errorMessage || error?.response?.data?.message || 'Failed to delete field mapping'
        message.error(errorMessage)
      },
    })

    // Import from catalog mutation
    const importFromCatalogMutation = useMutation({
      mutationFn: (catalogFieldIds: string[]) =>
        mappingApi.importFieldMappingsFromCatalog(
          selectedObjectMappingId!,
          catalogFieldIds,
        ),
      onSuccess: (data) => {
        message.success(
          `Successfully imported ${data.length} field mapping(s)`,
        )
        setIsImportModalOpen(false)
        setSelectedCatalogFieldIds([])
        queryClient.invalidateQueries({ queryKey: ['field-mappings'] })
        queryClient.invalidateQueries({ queryKey: ['field-mappings-for-filter'] })
      },
      onError: (error: any) => {
        const errorMessage = error?.message || error?.response?.data?.errorMessage || error?.response?.data?.message || 'Failed to import field mappings'
        message.error(errorMessage)
      },
    })

    // Handlers
    const handleCreateObjectMapping = () => {
      setEditingObjectMapping(null)
      objectMappingForm.resetFields()
      setIsObjectModalOpen(true)
    }

    const handleEditObjectMapping = (mapping: ObjectMapping) => {
      setEditingObjectMapping(mapping)
      objectMappingForm.setFieldsValue({
        objectApiName: mapping.objectApiName,
        targetTable: mapping.targetTable,
        pkStrategy: mapping.pkStrategy,
      })
      setIsObjectModalOpen(true)
    }

    const handleSubmitObjectMapping = (values: any) => {
      if (editingObjectMapping) {
        updateObjectMappingMutation.mutate({
          id: editingObjectMapping.id,
          data: values,
        })
      } else {
        if (!targetId) {
          message.error('Please select a target first')
          return
        }
        createObjectMappingMutation.mutate({
          sourceId,
          targetId,
          ...values,
        })
      }
    }

    const handleCreateFieldMapping = () => {
      if (!selectedObjectMappingId) {
        message.warning('Please select an object mapping first')
        return
      }
      setEditingFieldMapping(null)
      fieldMappingForm.resetFields()
      setIsFieldModalOpen(true)
    }

    const handleImportFromCatalog = () => {
      if (!selectedObjectMappingId) {
        message.warning('Please select an object mapping first')
        return
      }
      setSelectedCatalogFieldIds([])
      setIsImportModalOpen(true)
    }

    const handleImportSubmit = () => {
      if (selectedCatalogFieldIds.length === 0) {
        message.warning('Please select at least one field to import')
        return
      }
      importFromCatalogMutation.mutate(selectedCatalogFieldIds)
    }

    const handleEditFieldMapping = (mapping: FieldMapping) => {
      setEditingFieldMapping(mapping)
      fieldMappingForm.setFieldsValue({
        sfFieldApiName: mapping.sfFieldApiName,
        targetColumn: mapping.targetColumn,
        logicalType: mapping.logicalType,
        targetTypeOverride: mapping.targetTypeOverride,
      })
      setIsFieldModalOpen(true)
    }

    const handleSubmitFieldMapping = (values: any) => {
      if (editingFieldMapping) {
        updateFieldMappingMutation.mutate({
          id: editingFieldMapping.id,
          data: values,
        })
      } else {
        if (!selectedObjectMappingId) {
          message.error('Please select an object mapping first')
          return
        }
        createFieldMappingMutation.mutate({
          objectMappingId: selectedObjectMappingId,
          ...values,
        })
      }
    }

    const objectMappings = objectMappingsData?.items || []
    const fieldMappings = fieldMappingsData?.items || []

    // Object mapping columns
    const objectMappingColumns = [
      {
        title: 'SF Object',
        dataIndex: 'objectApiName',
        key: 'objectApiName',
        render: (text: string) => <Tag color="blue">{text}</Tag>,
      },
      {
        title: 'Target Table',
        dataIndex: 'targetTable',
        key: 'targetTable',
      },
      {
        title: 'PK Strategy',
        dataIndex: 'pkStrategy',
        key: 'pkStrategy',
        render: (strategy: PKStrategy) => (
          <Tag>{strategy.toUpperCase()}</Tag>
        ),
      },
      {
        title: 'Fields Count',
        key: 'fieldsCount',
        render: (_: any, record: ObjectMapping) =>
          record.fieldMappings?.length || 0,
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: ObjectMapping) => (
          <Space>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditObjectMapping(record)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete object mapping"
              description="Are you sure? This will also delete all field mappings."
              onConfirm={() => deleteObjectMappingMutation.mutate(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ]

    // Field mapping columns
    const fieldMappingColumns = [
      {
        title: 'SF Field',
        dataIndex: 'sfFieldApiName',
        key: 'sfFieldApiName',
        render: (text: string) => <Tag color="green">{text}</Tag>,
      },
      {
        title: 'Target Column',
        dataIndex: 'targetColumn',
        key: 'targetColumn',
      },
      {
        title: 'Logical Type',
        dataIndex: 'logicalType',
        key: 'logicalType',
      },
      {
        title: 'Type Override',
        dataIndex: 'targetTypeOverride',
        key: 'targetTypeOverride',
        render: (text: string) => text || '-',
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: FieldMapping) => (
          <Space>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditFieldMapping(record)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete field mapping"
              description="Are you sure?"
              onConfirm={() => deleteFieldMappingMutation.mutate(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ]

    return (
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ApiOutlined />
            Mappings
          </Title>
        </div>

        {!targetId && (
          <div style={{ marginBottom: 16, padding: 12, background: '#fff7e6', borderRadius: 4 }}>
            <Typography.Text type="warning">
              Please configure a target first to create mappings
            </Typography.Text>
          </div>
        )}

        <Tabs
          defaultActiveKey="objects"
          items={[
            {
              key: 'objects',
              label: 'Object Mappings',
              children: (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <Space>
                      <Input
                        placeholder="Search object mappings..."
                        prefix={<SearchOutlined />}
                        value={objectSearch}
                        onChange={(e) => setObjectSearch(e.target.value)}
                        allowClear
                        style={{ width: 300 }}
                      />
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateObjectMapping}
                        disabled={!targetId}
                      >
                        Create Object Mapping
                      </Button>
                    </Space>
                  </div>

                  <Table
                    columns={objectMappingColumns}
                    dataSource={objectMappings}
                    loading={objectMappingsLoading}
                    rowKey="id"
                    rowSelection={{
                      type: 'radio',
                      selectedRowKeys: selectedObjectMappingId
                        ? [selectedObjectMappingId]
                        : [],
                      onSelect: (record) => {
                        setSelectedObjectMappingId(record.id)
                      },
                    }}
                    pagination={false}
                    locale={{
                      emptyText: (
                        <Empty
                          description="No object mappings"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      ),
                    }}
                  />
                </>
              ),
            },
            {
              key: 'fields',
              label: (
                <span>
                  Field Mappings
                  {selectedObjectMappingId && (
                    <Tag color="green" style={{ marginLeft: 8 }}>
                      {selectedObjectMapping?.objectApiName || 'Selected'}
                    </Tag>
                  )}
                </span>
              ),
              disabled: !selectedObjectMappingId,
              children: !selectedObjectMappingId ? (
                <Empty
                  description={
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                        Please select an object mapping from the "Object Mappings" tab first
                      </Typography.Text>
                      <br />
                      <Typography.Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
                        Click on a row in the Object Mappings table to select it
                      </Typography.Text>
                    </div>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <>
                  {selectedObjectMapping && (
                    <div style={{ marginBottom: 16, padding: 12, background: '#f0f2f5', borderRadius: 4 }}>
                      <Space>
                        <Typography.Text strong>Selected Object:</Typography.Text>
                        <Tag color="blue">{selectedObjectMapping.objectApiName}</Tag>
                        <Typography.Text type="secondary">→</Typography.Text>
                        <Tag color="green">{selectedObjectMapping.targetTable}</Tag>
                        <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
                          ({fieldMappings.length} field mapping{fieldMappings.length !== 1 ? 's' : ''})
                        </Typography.Text>
                      </Space>
                    </div>
                  )}
                  <div style={{ marginBottom: 16 }}>
                    <Space>
                      <Input
                        placeholder="Search field mappings..."
                        prefix={<SearchOutlined />}
                        value={fieldSearch}
                        onChange={(e) => setFieldSearch(e.target.value)}
                        allowClear
                        style={{ width: 300 }}
                      />
                      <Button
                        type="default"
                        icon={<ImportOutlined />}
                        onClick={handleImportFromCatalog}
                        disabled={!selectedObjectMappingId}
                      >
                        Import from Catalog
                      </Button>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateFieldMapping}
                        disabled={!selectedObjectMappingId}
                      >
                        Create Field Mapping
                      </Button>
                    </Space>
                  </div>

                  <Table
                    columns={fieldMappingColumns}
                    dataSource={fieldMappings}
                    loading={fieldMappingsLoading}
                    rowKey="id"
                    pagination={false}
                    locale={{
                      emptyText: (
                        <Empty
                          description="No field mappings"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      ),
                    }}
                  />
                </>
              ),
            },
          ]}
        />

        {/* Object Mapping Modal */}
        <Modal
          title={
            editingObjectMapping
              ? 'Edit Object Mapping'
              : 'Create Object Mapping'
          }
          open={isObjectModalOpen}
          onCancel={() => {
            setIsObjectModalOpen(false)
            setEditingObjectMapping(null)
            objectMappingForm.resetFields()
          }}
          footer={null}
        >
          <Form
            form={objectMappingForm}
            layout="vertical"
            onFinish={handleSubmitObjectMapping}
          >
            <Form.Item
              label="Salesforce Object API Name"
              name="objectApiName"
              rules={[
                { required: true, message: 'Please select an object' },
              ]}
            >
              <Select
                placeholder={
                  selectedObjectsData?.items.length === 0
                    ? 'No selected objects. Please select objects in Catalog section first.'
                    : 'Select a Salesforce object'
                }
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                disabled={editingObjectMapping !== null || selectedObjectsData?.items.length === 0}
                notFoundContent={
                  selectedObjectsData?.items.length === 0
                    ? 'No selected objects available'
                    : undefined
                }
                onChange={(value) => {
                  // Auto-suggest target table name - use the same name as Salesforce object
                  // If editing, don't auto-fill
                  if (!editingObjectMapping) {
                    objectMappingForm.setFieldsValue({
                      targetTable: value,
                    })
                  }
                }}
              >
                {selectedObjectsData?.items.map((obj) => (
                  <Select.Option
                    key={obj.id}
                    value={obj.apiName}
                    label={obj.label || obj.apiName}
                  >
                    {obj.label || obj.apiName} ({obj.apiName})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Target Table Name"
              name="targetTable"
              rules={[
                { required: true, message: 'Please enter target table name' },
              ]}
            >
              <Input placeholder="e.g., accounts" />
            </Form.Item>

            <Form.Item
              label="Primary Key Strategy"
              name="pkStrategy"
              initialValue={PKStrategy.SF_ID}
            >
              <Select>
                <Select.Option value={PKStrategy.SF_ID}>
                  SF_ID (Use Salesforce ID)
                </Select.Option>
                <Select.Option value={PKStrategy.CUSTOM}>
                  CUSTOM (Custom primary key)
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={
                    createObjectMappingMutation.isPending ||
                    updateObjectMappingMutation.isPending
                  }
                >
                  {editingObjectMapping ? 'Update' : 'Create'}
                </Button>
                <Button
                  onClick={() => {
                    setIsObjectModalOpen(false)
                    setEditingObjectMapping(null)
                    objectMappingForm.resetFields()
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Field Mapping Modal */}
        <Modal
          title={
            editingFieldMapping
              ? 'Edit Field Mapping'
              : 'Create Field Mapping'
          }
          open={isFieldModalOpen}
          onCancel={() => {
            setIsFieldModalOpen(false)
            setEditingFieldMapping(null)
            fieldMappingForm.resetFields()
          }}
          footer={null}
        >
          <Form
            form={fieldMappingForm}
            layout="vertical"
            onFinish={handleSubmitFieldMapping}
          >
            <Form.Item
              label="Salesforce Field API Name"
              name="sfFieldApiName"
              rules={[
                { required: true, message: 'Please select a field' },
              ]}
            >
              <Select
                placeholder={
                  availableFields.length === 0
                    ? selectedFieldsData?.items.length === 0
                      ? 'No selected fields. Please select fields in Catalog section first.'
                      : 'All fields have been mapped'
                    : 'Select a Salesforce field'
                }
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                disabled={editingFieldMapping !== null || availableFields.length === 0}
                loading={!selectedFieldsData || existingFieldMappingsLoading}
                notFoundContent={
                  availableFields.length === 0
                    ? selectedFieldsData?.items.length === 0
                      ? 'No selected fields available'
                      : 'All fields have been mapped'
                    : undefined
                }
                onChange={(value) => {
                  // Auto-suggest target column name based on field API name
                  // Convert PascalCase to snake_case (e.g., FirstName -> first_name, CustomField__c -> custom_field__c)
                  const suggestedColumnName = value
                    .replace(/([A-Z])/g, '_$1')
                    .toLowerCase()
                    .replace(/^_/, '')
                  
                  // If editing, don't auto-fill
                  if (!editingFieldMapping) {
                    fieldMappingForm.setFieldsValue({
                      targetColumn: suggestedColumnName,
                    })
                  }
                }}
              >
                {availableFields.map((field) => (
                  <Select.Option
                    key={field.id}
                    value={field.apiName}
                    label={field.label || field.apiName}
                  >
                    {field.label || field.apiName} ({field.apiName}) - {field.sfType}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Target Column Name"
              name="targetColumn"
              rules={[
                { required: true, message: 'Please enter target column name' },
              ]}
            >
              <Input placeholder="e.g., name" />
            </Form.Item>

            <Form.Item
              label="Logical Type"
              name="logicalType"
              rules={[
                { required: true, message: 'Please enter logical type' },
              ]}
            >
              <Input placeholder="e.g., string, number, date" />
            </Form.Item>

            <Form.Item
              label="Target Type Override (Optional)"
              name="targetTypeOverride"
            >
              <Input placeholder="e.g., VARCHAR(255)" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={
                    createFieldMappingMutation.isPending ||
                    updateFieldMappingMutation.isPending
                  }
                >
                  {editingFieldMapping ? 'Update' : 'Create'}
                </Button>
                <Button
                  onClick={() => {
                    setIsFieldModalOpen(false)
                    setEditingFieldMapping(null)
                    fieldMappingForm.resetFields()
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Import from Catalog Modal */}
        <Modal
          title="Import Field Mappings from Catalog"
          open={isImportModalOpen}
          onCancel={() => {
            setIsImportModalOpen(false)
            setSelectedCatalogFieldIds([])
          }}
          onOk={handleImportSubmit}
          okText="Import"
          cancelText="Cancel"
          width={800}
          confirmLoading={importFromCatalogMutation.isPending}
        >
          <div style={{ marginBottom: 16 }}>
            <Typography.Text type="secondary">
              Select catalog fields to automatically create field mappings. Target column names and logical types will be auto-generated.
            </Typography.Text>
          </div>
          {availableFields.length > 0 ? (
            <>
              <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <Checkbox
                    checked={
                      availableFields.length > 0 &&
                      availableFields.every((field) =>
                        selectedCatalogFieldIds.includes(field.id),
                      )
                    }
                    indeterminate={
                      selectedCatalogFieldIds.length > 0 &&
                      selectedCatalogFieldIds.length < availableFields.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCatalogFieldIds(availableFields.map((f) => f.id))
                      } else {
                        setSelectedCatalogFieldIds([])
                      }
                    }}
                  >
                    Select All ({availableFields.length} available)
                  </Checkbox>
                </Space>
                {selectedCatalogFieldIds.length > 0 && (
                  <Typography.Text>
                    <strong>{selectedCatalogFieldIds.length}</strong> field(s) selected
                  </Typography.Text>
                )}
              </div>
              <div style={{ maxHeight: 400, overflowY: 'auto', border: '1px solid #d9d9d9', borderRadius: 4, padding: 8 }}>
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  {availableFields.map((field) => (
                    <div
                      key={field.id}
                      style={{
                        padding: '8px 12px',
                        border: '1px solid #f0f0f0',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        backgroundColor: selectedCatalogFieldIds.includes(field.id) ? '#e6f7ff' : 'transparent',
                      }}
                    >
                      <Checkbox
                        checked={selectedCatalogFieldIds.includes(field.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCatalogFieldIds([
                              ...selectedCatalogFieldIds,
                              field.id,
                            ])
                          } else {
                            setSelectedCatalogFieldIds(
                              selectedCatalogFieldIds.filter((id) => id !== field.id),
                            )
                          }
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500 }}>
                          {field.label || field.apiName} ({field.apiName})
                        </div>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                          Type: {field.sfType}
                          {field.isRequired && (
                            <Tag color="red" style={{ marginLeft: 8 }}>
                              Required
                            </Tag>
                          )}
                        </Typography.Text>
                      </div>
                    </div>
                  ))}
                </Space>
              </div>
            </>
          ) : (
            <Empty
              description={
                selectedFieldsData?.items.length === 0
                  ? 'No available fields to import. Please select fields in Catalog section first.'
                  : 'All fields have already been mapped'
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Modal>
      </Card>
    )
  },
)

