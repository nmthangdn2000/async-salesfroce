import { Outlet, createRootRoute, Link, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Layout, Menu, Button } from 'antd'
import { 
  HomeOutlined, 
  FolderOutlined, 
  DatabaseOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined 
} from '@ant-design/icons'
import { useMemo, useState } from 'react'

const { Sider, Content, Header } = Layout

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  
  // Check if current route is OAuth callback - hide sidebar and header
  const isOAuthCallback = location.pathname === '/oauth/callback'
  
  // Xác định menu item đang active dựa trên pathname
  const selectedKey = useMemo(() => {
    const pathname = location.pathname
    if (pathname === '/') return 'home'
    if (pathname.startsWith('/projects')) return 'projects'
    if (pathname.startsWith('/sources')) return 'sources'
    return 'home'
  }, [location.pathname])

  const siderWidth = collapsed ? 80 : 250

  // Full screen layout for OAuth callback
  if (isOAuthCallback) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Content style={{ padding: 0, background: '#f0f2f5' }}>
          <Outlet />
        </Content>
      </Layout>
    )
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme="dark"
        width={250}
        collapsedWidth={80}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'center',
            color: 'white',
            fontSize: collapsed ? '16px' : '18px',
            fontWeight: 'bold',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: collapsed ? '0' : '0 16px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {collapsed ? 'AS' : 'Async Salesforce'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          inlineCollapsed={collapsed}
          style={{ borderRight: 0, marginTop: '8px' }}
          items={[
            {
              key: 'home',
              icon: <HomeOutlined />,
              label: <Link to="/">Home</Link>,
            },
            {
              key: 'projects',
              icon: <FolderOutlined />,
              label: <Link to="/projects">Projects</Link>,
            },
            {
              key: 'sources',
              icon: <DatabaseOutlined />,
              label: <Link to="/sources">Sources</Link>,
            },
          ]}
        />
      </Sider>
      <Layout style={{ marginLeft: siderWidth, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div style={{ fontSize: '16px', fontWeight: 500 }}>
            {selectedKey === 'home' && 'Home'}
            {selectedKey === 'projects' && 'Projects'}
            {selectedKey === 'sources' && 'Sources'}
          </div>
        </Header>
        <Content style={{ padding: '0', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </Content>
      </Layout>
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </Layout>
  )
}
