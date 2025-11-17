import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useCallback } from 'react'
import { Result, Button, Card,  } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

export const Route = createFileRoute('/oauth/callback')({
  component: OAuthCallbackPage,
  validateSearch: (search: Record<string, unknown>) => {
    // Handle success as string or boolean from query params
    let successValue: string | boolean | undefined = undefined
    if (search.success !== undefined && search.success !== null) {
      if (typeof search.success === 'boolean') {
        successValue = search.success
      } else if (typeof search.success === 'string') {
        successValue = search.success
      }
    }
    
    return {
      success: successValue,
      error: (search.error as string) || undefined,
      sourceId: (search.sourceId as string) || undefined,
    }
  },
})

function OAuthCallbackPage() {
  const { success, error, sourceId } = Route.useSearch()

  // Also check URL params directly as fallback
  const urlParams = new URLSearchParams(window.location.search)
  const successParam = urlParams.get('success')
  const errorParam = urlParams.get('error')
  const sourceIdParam = urlParams.get('sourceId')

  // Function to send message to parent window
  const sendMessageToParent = useCallback(() => {
    const actualSuccess = success === 'true' || success === true || successParam === 'true'
    const actualError = error || errorParam || null
    const actualSourceId = sourceId || sourceIdParam || null
    
    if (window.opener && !window.opener.closed) {
      const message = {
        type: 'oauth-callback',
        success: actualSuccess,
        error: actualError,
        sourceId: actualSourceId,
      }
      window.opener.postMessage(message, window.location.origin)
    }
  }, [success, error, sourceId, successParam, errorParam, sourceIdParam])

  useEffect(() => {
    // Send message to parent window if opened in popup
    sendMessageToParent()
    
    // Auto-close popup after a short delay (only if success)
    if (window.opener && !window.opener.closed) {
      const isSuccess = 
        success === 'true' || 
        success === true || 
        successParam === 'true' ||
        successParam === '1'
      
      if (isSuccess) {
        setTimeout(() => {
          window.close()
        }, 2000)
      }
    }
  }, [sendMessageToParent, success, successParam])

  // Check success: use URL params as fallback if Route.useSearch doesn't work
  const isSuccess = 
    success === 'true' || 
    success === true || 
    success === '1' ||
    successParam === 'true' ||
    successParam === '1'
  const errorMessage = error || errorParam || 'Unknown error occurred'
  const displaySourceId = sourceId || sourceIdParam

  return (
    <div
      style={{
        padding: '24px',
        background: '#f0f2f5',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card style={{ maxWidth: 500, width: '100%' }}>
        {isSuccess ? (
          <Result
            status="success"
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="OAuth Authentication Successful"
            subTitle={
              displaySourceId
                ? `Successfully connected source ${displaySourceId} to Salesforce. You can close this window.`
                : 'Successfully connected to Salesforce. You can close this window.'
            }
            extra={[
              <Button
                type="primary"
                key="close"
                onClick={() => {
                  if (window.opener && !window.opener.closed) {
                    // Send message again to ensure parent window receives it
                    sendMessageToParent()
                    // Small delay to ensure message is sent, then reload parent window
                    setTimeout(() => {
                      window.opener.location.reload()
                      window.close()
                    }, 100)
                  } else {
                    // If not in popup, reload current window
                    window.location.reload()
                  }
                }}
              >
                {window.opener ? 'Close Window' : 'Reload'}
              </Button>,
            ]}
          />
        ) : (
          <Result
            status="error"
            icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            title="OAuth Authentication Failed"
            subTitle={errorMessage}
            extra={[
              <Button
                type="primary"
                key="close"
                onClick={() => {
                  if (window.opener && !window.opener.closed) {
                    // Send message again to ensure parent window receives it
                    sendMessageToParent()
                    // Small delay to ensure message is sent, then reload parent window
                    setTimeout(() => {
                      window.opener.location.reload()
                      window.close()
                    }, 100)
                  } else {
                    // If not in popup, reload current window
                    window.location.reload()
                  }
                }}
              >
                {window.opener ? 'Close Window' : 'Reload'}
              </Button>,
            ]}
          />
        )}
      </Card>
    </div>
  )
}
