import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Button,
  Card,
  Form,
  message,
  Modal,
  Space,
  Tag,
  Empty,
  Spin,
  Table,
  Typography,
  Statistic,
  Select,
  Popconfirm,
  Drawer,
} from 'antd'
import { UserAddOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { projectApi } from '@/services/project.service'
import { sourceApi } from '@/services/source.service'
import { projectMemberApi } from '@/services/project-member.service'
import { userApi } from '@/services/user.service'
import {
  SourceProvider,
  SourceStatus,
} from '@/types/source'
import { ProjectMemberRole } from '@/types/project-member'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const { Title, Text } = Typography

export const Route = createFileRoute('/projects/$id')({
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [memberForm] = Form.useForm()
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
  const [isMembersDrawerOpen, setIsMembersDrawerOpen] = useState(false)
  const queryClient = useQueryClient()

  // Fetch project details - include id in query key to refetch when id changes
  const { data: projectsData, isLoading: projectLoading } = useQuery({
    queryKey: ['projects', 'all', id],
    queryFn: () =>
      projectApi.getAll({
        page: 1,
        take: 1000,
      }),
  })

  // Fetch sources for project
  const { data: sourcesData, isLoading: sourcesLoading } = useQuery({
    queryKey: ['sources', 'project', id],
    queryFn: () =>
      sourceApi.getAll({
        projectId: id,
        page: 1,
        take: 1000,
      }),
    enabled: !!id,
  })

  // Fetch project members
  const { data: membersData, isLoading: membersLoading } = useQuery({
    queryKey: ['project-members', 'project', id],
    queryFn: () =>
      projectMemberApi.getAll({
        projectId: id,
        page: 1,
        take: 1000,
      }),
    enabled: !!id,
  })

  // Fetch all users for add member modal
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users', 'all'],
    queryFn: () =>
      userApi.getAll({
        page: 1,
        take: 1000,
      }),
    enabled: isAddMemberModalOpen,
  })

  const addMemberMutation = useMutation({
    mutationFn: projectMemberApi.create,
    onSuccess: () => {
      message.success('Member added successfully')
      setIsAddMemberModalOpen(false)
      memberForm.resetFields()
      queryClient.invalidateQueries({ queryKey: ['project-members'] })
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to add member')
    },
  })

  const deleteMemberMutation = useMutation({
    mutationFn: projectMemberApi.delete,
    onSuccess: () => {
      message.success('Member removed successfully')
      queryClient.invalidateQueries({ queryKey: ['project-members'] })
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to remove member')
    },
  })

  const handleAddMember = (values: { userId: string; role: ProjectMemberRole }) => {
    addMemberMutation.mutate({
      projectId: id,
      userId: values.userId,
      role: values.role,
    })
  }

  const handleDeleteMember = (memberId: string) => {
    deleteMemberMutation.mutate(memberId)
  }

  const project = projectsData?.items.find((p) => p.id === id)
  
  // Show loading while project is being fetched
  if (projectLoading) {
    return (
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" />
      </div>
    )
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

  const sources = sourcesData?.items || []
  const activeSources = sources.filter((s) => s.status === SourceStatus.ACTIVE).length
  const members = membersData?.items || []
  const users = usersData?.items || []

  // Get available users (not already in project)
  const availableUsers = users.filter(
    (user) => !members.some((member) => member.userId === user.id)
  )

  const getRoleColor = (role: ProjectMemberRole) => {
    switch (role) {
      case ProjectMemberRole.OWNER:
        return 'red'
      case ProjectMemberRole.ADMIN:
        return 'orange'
      case ProjectMemberRole.EDITOR:
        return 'blue'
      case ProjectMemberRole.VIEWER:
        return 'green'
      default:
        return 'default'
    }
  }

  const getUserDisplayName = (member: typeof members[0]) => {
    if (member.user?.profile?.firstName || member.user?.profile?.lastName) {
      return `${member.user.profile.firstName || ''} ${member.user.profile.lastName || ''}`.trim()
    }
    return member.user?.email || 'Unknown User'
  }

  // Table columns for sources
  const sourceColumns = [
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
      render: (env: string) => <Tag>{env.toUpperCase()}</Tag>,
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

  // Table columns for project members
  const memberColumns = [
    {
      title: 'User',
      key: 'user',
      render: (_: any, member: typeof members[0]) => (
        <div>
          <div style={{ fontWeight: 500 }}>{getUserDisplayName(member)}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {member.user?.email}
          </Text>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: ProjectMemberRole) => (
        <Tag color={getRoleColor(role)}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Added At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, member: typeof members[0]) => (
        <Popconfirm
          title="Remove member"
          description="Are you sure you want to remove this member from the project?"
          onConfirm={() => handleDeleteMember(member.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            size="small"
          >
            Remove
          </Button>
        </Popconfirm>
      ),
    },
  ]

  if (!project) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <Empty
            description="Project not found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Project Header */}
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
              onClick={() => navigate({ to: '/projects' })}
              style={{ marginBottom: 16 }}
            >
              Back to Projects
            </Button>
            <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
              {project.name}
            </Title>
            <Space>
              <Tag>{project.slug}</Tag>
              <Text type="secondary">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </Text>
            </Space>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div style={{ marginBottom: 24 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space size="large">
              <Statistic
                title="Total Sources"
                value={sources.length}
                valueStyle={{ color: '#1890ff' }}
              />
              <Statistic
                title="Active Sources"
                value={activeSources}
                valueStyle={{ color: '#52c41a' }}
              />
              <Statistic
                title="Disabled Sources"
                value={sources.length - activeSources}
                valueStyle={{ color: '#ff4d4f' }}
              />
              <Statistic
                title="Members"
                value={members.length}
                valueStyle={{ color: '#722ed1' }}
              />
            </Space>
            <Button
              type="default"
              icon={<UserAddOutlined />}
              onClick={() => setIsMembersDrawerOpen(true)}
            >
              View Members
            </Button>
          </div>
        </Card>
      </div>

      {/* Sources Table */}
      <Card>
        <Title level={4} style={{ marginBottom: 16 }}>
          Sources
        </Title>
        <Table
          columns={sourceColumns}
          dataSource={sources}
          loading={sourcesLoading}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* Add Member Modal */}
      <Modal
        title="Add Member to Project"
        open={isAddMemberModalOpen}
        onCancel={() => {
          setIsAddMemberModalOpen(false)
          memberForm.resetFields()
        }}
        footer={null}
      >
        <Form
          form={memberForm}
          layout="vertical"
          onFinish={handleAddMember}
          autoComplete="off"
        >
          <Form.Item
            label="User"
            name="userId"
            rules={[{ required: true, message: 'Please select a user' }]}
          >
            <Select
              placeholder="Select a user"
              loading={usersLoading}
              showSearch
              filterOption={(input, option) => {
                const label = String(option?.label ?? '')
                return label.toLowerCase().includes(input.toLowerCase())
              }}
            >
              {availableUsers.map((user) => {
                const displayName = `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || user.email
                return (
                  <Select.Option key={user.id} value={user.id} label={displayName}>
                    <div>
                      <div>{displayName}</div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {user.email}
                      </Text>
                    </div>
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role' }]}
            initialValue={ProjectMemberRole.VIEWER}
          >
            <Select placeholder="Select a role">
              <Select.Option value={ProjectMemberRole.OWNER}>
                Owner
              </Select.Option>
              <Select.Option value={ProjectMemberRole.ADMIN}>
                Admin
              </Select.Option>
              <Select.Option value={ProjectMemberRole.EDITOR}>
                Editor
              </Select.Option>
              <Select.Option value={ProjectMemberRole.VIEWER}>
                Viewer
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={addMemberMutation.isPending}
              >
                Add Member
              </Button>
              <Button
                onClick={() => {
                  setIsAddMemberModalOpen(false)
                  memberForm.resetFields()
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Members Drawer */}
      <Drawer
        title="Project Members"
        placement="right"
        onClose={() => setIsMembersDrawerOpen(false)}
        open={isMembersDrawerOpen}
        width={600}
        extra={
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => {
              setIsMembersDrawerOpen(false)
              setIsAddMemberModalOpen(true)
            }}
          >
            Add Member
          </Button>
        }
      >
        <Table
          columns={memberColumns}
          dataSource={members}
          loading={membersLoading}
          rowKey="id"
          pagination={false}
        />
      </Drawer>
    </div>
  )
}

