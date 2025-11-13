import { createFileRoute, Link, Outlet, useMatchRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { sourceApi } from '@/services/source.service'
import { projectApi } from '@/services/project.service'
import {
  SourceProvider,
  SourceEnvironment,
  SourceStatus,
} from '@/types/source'
import type { Project } from '@/types/project'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/sources')({
  component: SourcesPage,
})

function SourcesPage() {
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>()
  const [selectedProvider, setSelectedProvider] = useState<SourceProvider | undefined>()
  const [selectedEnvironment, setSelectedEnvironment] = useState<SourceEnvironment | undefined>()
  const [selectedStatus, setSelectedStatus] = useState<SourceStatus | undefined>()
  const [pagination, setPagination] = useState({ page: 1, take: 10 })
  const queryClient = useQueryClient()
  const matchRoute = useMatchRoute()
  const isDetailPage = matchRoute({ to: '/sources/$id' })

  // Fetch projects for dropdown
  const { data: projectsData } = useQuery({
    queryKey: ['projects', 'all'],
    queryFn: () => projectApi.getAll({ page: 1, take: 1000 }),
    enabled: !isDetailPage,
  })

  const { data, isLoading } = useQuery({
    queryKey: [
      'sources',
      pagination.page,
      pagination.take,
      searchText,
      selectedProjectId,
      selectedProvider,
      selectedEnvironment,
      selectedStatus,
    ],
    queryFn: () =>
      sourceApi.getAll({
        page: pagination.page,
        take: pagination.take,
        search: searchText || undefined,
        projectId: selectedProjectId,
        provider: selectedProvider,
        environment: selectedEnvironment,
        status: selectedStatus,
      }),
    enabled: !isDetailPage,
  })

  const createMutation = useMutation({
    mutationFn: sourceApi.create,
    onSuccess: () => {
      message.success('Source created successfully')
      setIsModalOpen(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['sources'] })
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to create source')
    },
  })

  const handleCreate = (values: {
    projectId: string
    provider: SourceProvider
    name: string
    environment?: SourceEnvironment
    status?: SourceStatus
  }) => {
    createMutation.mutate(values)
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

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <Link
          to="/sources/$id"
          params={{ id: record.id }}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          {name}
        </Link>
      ),
    },
    {
      title: 'Provider',
      dataIndex: 'provider',
      key: 'provider',
      render: (provider: SourceProvider) => (
        <Tag color={getProviderColor(provider)}>
          {provider.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Environment',
      dataIndex: 'environment',
      key: 'environment',
      render: (env: SourceEnvironment) => (
        <Tag>{env.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: SourceStatus) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ]

  // If we're on a detail page, only render the outlet
  if (isDetailPage) {
    return <Outlet />
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <h1 style={{ margin: 0 }}>Sources</h1>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              Create Source
            </Button>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Input
              placeholder="Search sources..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value)
                setPagination({ ...pagination, page: 1 })
              }}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Filter by Project"
              style={{ width: '100%' }}
              allowClear
              value={selectedProjectId}
              onChange={(value) => {
                setSelectedProjectId(value)
                setPagination({ ...pagination, page: 1 })
              }}
            >
              {projectsData?.items.map((project: Project) => (
                <Select.Option key={project.id} value={project.id}>
                  {project.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Filter by Provider"
              style={{ width: '100%' }}
              allowClear
              value={selectedProvider}
              onChange={(value) => {
                setSelectedProvider(value)
                setPagination({ ...pagination, page: 1 })
              }}
            >
              {Object.values(SourceProvider).map((provider) => (
                <Select.Option key={provider} value={provider}>
                  {provider.toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Filter by Environment"
              style={{ width: '100%' }}
              allowClear
              value={selectedEnvironment}
              onChange={(value) => {
                setSelectedEnvironment(value)
                setPagination({ ...pagination, page: 1 })
              }}
            >
              {Object.values(SourceEnvironment).map((env) => (
                <Select.Option key={env} value={env}>
                  {env.toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Filter by Status"
              style={{ width: '100%' }}
              allowClear
              value={selectedStatus}
              onChange={(value) => {
                setSelectedStatus(value)
                setPagination({ ...pagination, page: 1 })
              }}
            >
              {Object.values(SourceStatus).map((status) => (
                <Select.Option key={status} value={status}>
                  {status.toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={data?.items || []}
          loading={isLoading}
          rowKey="id"
          pagination={{
            current: pagination.page,
            pageSize: pagination.take,
            total: data?.meta.totalItems || 0,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} sources`,
            onChange: (page, pageSize) => {
              setPagination({ page, take: pageSize })
            },
          }}
        />
      </Card>

      <Modal
        title="Create New Source"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          autoComplete="off"
        >
          <Form.Item
            label="Project"
            name="projectId"
            rules={[{ required: true, message: 'Please select a project' }]}
          >
            <Select placeholder="Select a project">
              {projectsData?.items.map((project: Project) => (
                <Select.Option key={project.id} value={project.id}>
                  {project.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Provider"
            name="provider"
            rules={[{ required: true, message: 'Please select a provider' }]}
          >
            <Select placeholder="Select a provider">
              {Object.values(SourceProvider).map((provider) => (
                <Select.Option key={provider} value={provider}>
                  {provider.toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Source Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter source name' },
              { min: 1, message: 'Source name must be at least 1 character' },
            ]}
          >
            <Input placeholder="Enter source name" />
          </Form.Item>

          <Form.Item
            label="Environment"
            name="environment"
            initialValue={SourceEnvironment.PROD}
          >
            <Select>
              {Object.values(SourceEnvironment).map((env) => (
                <Select.Option key={env} value={env}>
                  {env.toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            initialValue={SourceStatus.ACTIVE}
          >
            <Select>
              {Object.values(SourceStatus).map((status) => (
                <Select.Option key={status} value={status}>
                  {status.toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isPending}
              >
                Create
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false)
                  form.resetFields()
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

