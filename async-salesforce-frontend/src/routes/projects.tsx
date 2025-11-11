import { createFileRoute } from '@tanstack/react-router'
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
  Space,
  Table,
  Tag,
} from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { projectApi } from '@/services/project.service'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
})

function ProjectsPage() {
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({ page: 1, take: 10 })
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['projects', pagination.page, pagination.take, searchText],
    queryFn: () =>
      projectApi.getAll({
        page: pagination.page,
        take: pagination.take,
        search: searchText || undefined,
      }),
  })

  const createMutation = useMutation({
    mutationFn: projectApi.create,
    onSuccess: () => {
      message.success('Project created successfully')
      setIsModalOpen(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to create project')
    },
  })

  const handleCreate = (values: { name: string }) => {
    createMutation.mutate(values)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug: string) => <Tag>{slug}</Tag>,
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

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <h1 style={{ margin: 0 }}>Projects</h1>
          </Col>
          <Col>
            <Space>
              <Input
                placeholder="Search projects..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value)
                  setPagination({ ...pagination, page: 1 })
                }}
                style={{ width: 250 }}
                allowClear
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalOpen(true)}
              >
                Create Project
              </Button>
            </Space>
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
            showTotal: (total) => `Total ${total} projects`,
            onChange: (page, pageSize) => {
              setPagination({ page, take: pageSize })
            },
          }}
        />
      </Card>

      <Modal
        title="Create New Project"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          autoComplete="off"
        >
          <Form.Item
            label="Project Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter project name' },
              { min: 1, message: 'Project name must be at least 1 character' },
            ]}
          >
            <Input placeholder="Enter project name" />
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

