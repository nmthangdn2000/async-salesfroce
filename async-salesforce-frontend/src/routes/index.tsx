import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, Space } from 'antd'
import { FolderOutlined, DatabaseOutlined, ApiOutlined } from '@ant-design/icons'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>
          Async Salesforce
        </h1>
        <p style={{ fontSize: '16px', color: '#666' }}>
          Manage your projects, sources, and targets
        </p>
      </div>

      <Space size="large" style={{ width: '100%', justifyContent: 'center' }}>
        <Link to="/projects">
          <Card
            hoverable
            style={{ width: 300, textAlign: 'center' }}
            cover={
              <div style={{ padding: '40px', fontSize: '64px', color: '#1890ff' }}>
                <FolderOutlined />
              </div>
            }
          >
            <Card.Meta
              title="Projects"
              description="Manage and view all your projects"
            />
          </Card>
        </Link>

        <Link to="/sources">
          <Card
            hoverable
            style={{ width: 300, textAlign: 'center' }}
            cover={
              <div style={{ padding: '40px', fontSize: '64px', color: '#52c41a' }}>
                <DatabaseOutlined />
              </div>
            }
          >
            <Card.Meta
              title="Sources"
              description="Manage and configure your data sources"
            />
          </Card>
        </Link>

        <Link to="/targets">
          <Card
            hoverable
            style={{ width: 300, textAlign: 'center' }}
            cover={
              <div style={{ padding: '40px', fontSize: '64px', color: '#722ed1' }}>
                <ApiOutlined />
              </div>
            }
          >
            <Card.Meta
              title="Targets"
              description="Manage and configure your data targets"
            />
          </Card>
        </Link>
      </Space>
    </div>
  )
}
