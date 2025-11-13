import { createFileRoute, Link, Outlet, useMatchRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Space,
  Tag,
  Empty,
  Spin,
  List,
  Typography,
} from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { projectApi } from '@/services/project.service'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const { Title, Text } = Typography

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
})

function ProjectsPage() {
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const queryClient = useQueryClient()
  const matchRoute = useMatchRoute()
  
  const isDetailPage = matchRoute({ to: '/projects/$id' })

  // Fetch all projects - only when not on detail page
  const { data, isLoading } = useQuery({
    queryKey: ['projects', 'all', searchText],
    queryFn: () =>
      projectApi.getAll({
        page: 1,
        take: 1000,
        search: searchText || undefined,
      }),
    enabled: !isDetailPage,
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

  const projects = data?.items || []

  return (
    <>
      {isDetailPage ? (
        <Outlet />
      ) : (
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={2} style={{ margin: 0 }}>
              Projects
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              Create Project
            </Button>
          </div>
          <Input
            placeholder="Search projects..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ maxWidth: 400 }}
          />
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin />
          </div>
        ) : projects.length === 0 ? (
          <Empty
            description="No projects found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={projects}
            renderItem={(project) => (
              <List.Item>
                <Link
                  to="/projects/$id"
                  params={{ id: project.id }}
                  style={{ textDecoration: 'none' }}
                >
                  <Card
                    hoverable
                    style={{ height: '100%' }}
                  >
                    <Title level={4} style={{ margin: 0, marginBottom: 8 }}>
                      {project.name}
                    </Title>
                    <Space>
                      <Tag>{project.slug}</Tag>
                    </Space>
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Created: {new Date(project.createdAt).toLocaleDateString()}
                      </Text>
                    </div>
                  </Card>
                </Link>
              </List.Item>
            )}
          />
        )}
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
      )}
    </>
  )
}

