import { useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import type { SourceSetting } from '@/types/source-setting'

const POPUP_WIDTH = 600
const POPUP_HEIGHT = 700

export function useOAuth(sourceId: string, sourceSetting: SourceSetting | undefined) {
  const queryClient = useQueryClient()

  const getCallbackUrl = useCallback(() => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
    const baseUrl = apiBaseUrl.replace(/\/api$/, '')
    return `${baseUrl}/api/auth/oauth/callback`
  }, [])

  const handleAuthenticate = useCallback(async () => {
    try {
      if (!sourceSetting) {
        message.error('Please configure settings first')
        return
      }

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
      const authUrl = `${apiBaseUrl}/auth/oauth/authenticate?sourceId=${sourceId}`
      
      const left = (window.screen.width - POPUP_WIDTH) / 2
      const top = (window.screen.height - POPUP_HEIGHT) / 2
      
      const popup = window.open(
        authUrl,
        'oauth_popup',
        `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
      )
      
      if (popup) {
        const checkPopup = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopup)
            queryClient.invalidateQueries({ queryKey: ['source-settings', sourceId] })
          }
        }, 500)
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to authenticate')
    }
  }, [sourceSetting, sourceId, queryClient])

  // Listen for OAuth callback messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const allowedOrigin = window.location.origin
      if (event.origin !== allowedOrigin) {
        return
      }

      if (event.data?.type === 'oauth-callback') {
        const { success, error: errorMessage, sourceId: callbackSourceId } = event.data

        if (callbackSourceId && callbackSourceId !== sourceId) {
          return
        }

        if (success) {
          message.success('Successfully connected to Salesforce!')
          queryClient.invalidateQueries({ queryKey: ['source-settings', sourceId] })
        } else {
          message.error(
            errorMessage || 'Failed to connect to Salesforce. Please try again.'
          )
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [sourceId, queryClient])

  return {
    getCallbackUrl,
    handleAuthenticate,
  }
}

