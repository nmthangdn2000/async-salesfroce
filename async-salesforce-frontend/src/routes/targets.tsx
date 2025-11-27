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
import { targetApi } from '@/services/target.service'
import { projectApi } from '@/services/project.service'
import { sourceApi } from '@/services/source.service'
import { TargetKind } from '@/types/target'
import type { Project } from '@/types/project'
import type { Source } from '@/types/source'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/targets')({
  component: TargetsPage,
})

function TargetsPage() {
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>()
  const [selectedKind, setSelectedKind] = useState<TargetKind | undefined>()
  const [pagination, setPagination] = useState({ page: 1, take: 10 })
  const queryClient = useQueryClient()
  const matchRoute = useMatchRoute()
  const isDetailPage = matchRoute({ to: '/targets/$id' })

  // Fetch projects for dropdown
  const { data: projectsData } = useQuery({
    queryKey: ['projects', 'all'],
    queryFn: () => projectApi.getAll({ page: 1, take: 1000 }),
    enabled: !isDetailPage,
  })

  const { data, isLoading } = useQuery({
    queryKey: [
      'targets',
      pagination.page,
      pagination.take,
      searchText,
      selectedProjectId,
      selectedKind,
    ],
    queryFn: () =>
      targetApi.getAll({
        page: pagination.page,
        take: pagination.take,
        search: searchText || undefined,
        projectId: selectedProjectId,
        kind: selectedKind,
      }),
    enabled: !isDetailPage,
  })

  const createMutation = useMutation({
    mutationFn: targetApi.create,
    onSuccess: () => {
      message.success('Target created successfully')
      setIsModalOpen(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['targets'] })
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to create target')
    },
  })

  const handleCreate = (values: {
    projectId: string
    sourceId: string
    kind: TargetKind
    name: string
  }) => {
    createMutation.mutate(values)
  }

  // Watch projectId to fetch sources
  const selectedProjectIdInForm = Form.useWatch('projectId', form)
  
  const { data: sourcesData } = useQuery({
    queryKey: ['sources', 'project', selectedProjectIdInForm],
    queryFn: () => sourceApi.getAll({ projectId: selectedProjectIdInForm, page: 1, take: 1000 }),
    enabled: !!selectedProjectIdInForm && isModalOpen,
  })

  const getKindColor = (kind: TargetKind) => {
    switch (kind) {
      case TargetKind.POSTGRES:
        return 'blue'
      case TargetKind.MYSQL:
        return 'orange'
      case TargetKind.SQLSERVER:
        return 'purple'
      case TargetKind.BIGQUERY:
        return 'green'
      case TargetKind.SNOWFLAKE:
        return 'cyan'
      case TargetKind.CLICKHOUSE:
        return 'geekblue'
      case TargetKind.MONGODB:
        return 'green'
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
          to="/targets/$id"
          params={{ id: record.id }}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          {name}
        </Link>
      ),
    },
    {
      title: 'Kind',
      dataIndex: 'kind',
      key: 'kind',
      render: (kind: TargetKind) => (
        <Tag color={getKindColor(kind)}>
          {kind.toUpperCase()}
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
            <h1 style={{ margin: 0 }}>Targets</h1>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              Create Target
            </Button>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Input
              placeholder="Search targets..."
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
              placeholder="Filter by Kind"
              style={{ width: '100%' }}
              allowClear
              value={selectedKind}
              onChange={(value) => {
                setSelectedKind(value)
                setPagination({ ...pagination, page: 1 })
              }}
            >
              {Object.values(TargetKind).map((kind) => (
                <Select.Option key={kind} value={kind}>
                  {kind.toUpperCase()}
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
            showTotal: (total) => `Total ${total} targets`,
            onChange: (page, pageSize) => {
              setPagination({ page, take: pageSize })
            },
          }}
        />
      </Card>

      <Modal
        title="Create New Target"
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
            <Select 
              placeholder="Select a project"
              onChange={() => {
                // Reset sourceId when project changes
                form.setFieldsValue({ sourceId: undefined })
              }}
            >
              {projectsData?.items.map((project: Project) => (
                <Select.Option key={project.id} value={project.id}>
                  {project.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Source"
            name="sourceId"
            rules={[{ required: true, message: 'Please select a source' }]}
          >
            <Select 
              placeholder="Select a source"
              disabled={!selectedProjectIdInForm}
            >
              {sourcesData?.items.map((source: Source) => (
                <Select.Option key={source.id} value={source.id}>
                  {source.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Target Kind"
            name="kind"
            rules={[{ required: true, message: 'Please select a target kind' }]}
          >
            <Select placeholder="Select a target kind">
              {Object.values(TargetKind).map((kind) => (
                <Select.Option key={kind} value={kind}>
                  {kind.toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Target Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter target name' },
              { min: 1, message: 'Target name must be at least 1 character' },
            ]}
          >
            <Input placeholder="Enter target name" />
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

