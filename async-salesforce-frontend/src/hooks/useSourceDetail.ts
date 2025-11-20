import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { sourceApi } from '@/services/source.service'
import { projectApi } from '@/services/project.service'
import { sourceSettingApi } from '@/services/source-setting.service'
import { AuthType } from '@/types/source-setting'

export function useSourceDetail(sourceId: string) {
  const queryClient = useQueryClient()

  // Fetch source details
  const { data: source, isLoading: sourceLoading } = useQuery({
    queryKey: ['sources', sourceId],
    queryFn: () => sourceApi.getById(sourceId),
    enabled: !!sourceId,
  })

  // Fetch project details
  const { data: projectsData } = useQuery({
    queryKey: ['projects', 'all'],
    queryFn: () =>
      projectApi.getAll({
        page: 1,
        take: 1000,
      }),
  })

  // Fetch source setting
  const { data: sourceSetting } = useQuery({
    queryKey: ['source-settings', sourceId],
    queryFn: () => sourceSettingApi.getBySourceId(sourceId),
    enabled: !!sourceId,
    retry: false,
  })

  const project = useMemo(
    () => projectsData?.items.find((p) => p.id === source?.projectId),
    [projectsData?.items, source?.projectId]
  )

  const isConnected = useMemo(
    () => !!sourceSetting?.refreshToken,
    [sourceSetting?.refreshToken]
  )

  // Create/Update mutation
  const saveSettingMutation = useMutation({
    mutationFn: async (values: {
      instanceUrl: string
      authType: AuthType
      scopes?: string[]
      clientId?: string
      clientSecret?: string
      refreshToken?: string
    }) => {
      if (sourceSetting) {
        return sourceSettingApi.update(sourceSetting.id, values)
      } else {
        return sourceSettingApi.create({
          sourceId,
          ...values,
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['source-settings', sourceId] })
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to save source setting')
    },
  })

  return {
    source,
    sourceLoading,
    project,
    sourceSetting,
    isConnected,
    saveSettingMutation,
  }
}

