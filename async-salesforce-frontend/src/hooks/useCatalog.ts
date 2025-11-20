import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { catalogApi } from '@/services/catalog.service'

export function useCatalog(
  sourceId: string,
  selectedObjectId: string | null,
  objectSearch: string,
  objectFilterSelected: boolean | undefined,
  fieldSearch: string,
  fieldFilterSelected: boolean | undefined
) {
  const queryClient = useQueryClient()

  // Fetch catalog objects
  const { data: catalogData } = useQuery({
    queryKey: ['catalog-objects', sourceId, objectSearch, objectFilterSelected],
    queryFn: () =>
      catalogApi.getObjects({
        sourceId,
        search: objectSearch || undefined,
        isSelected: objectFilterSelected,
        page: 1,
        take: 1000,
      }),
    enabled: !!sourceId,
    retry: false,
  })

  // Fetch catalog fields
  const { data: fieldsData, isLoading: fieldsLoading, error: fieldsError } = useQuery({
    queryKey: ['catalog-fields', selectedObjectId, fieldSearch, fieldFilterSelected],
    queryFn: () => {
      if (!selectedObjectId) {
        throw new Error('Object ID is required')
      }
      return catalogApi.getFields({
        objectId: selectedObjectId,
        search: fieldSearch || undefined,
        isSelected: fieldFilterSelected,
        page: 1,
        take: 1000,
      })
    },
    enabled: !!selectedObjectId,
    retry: false,
  })

  // Sync objects mutation
  const syncObjectsMutation = useMutation({
    mutationFn: async () => {
      return catalogApi.syncObjects(sourceId)
    },
    onSuccess: (data) => {
      message.success(
        `Successfully synced! Total: ${data.totalObjects}, Updated: ${data.updatedObjects}, Created: ${data.createdObjects}, Removed: ${data.removedObjects}`
      )
      queryClient.invalidateQueries({ queryKey: ['catalog-objects', sourceId] })
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to sync objects from Salesforce')
    },
  })

  // Sync fields mutation
  const syncFieldsMutation = useMutation({
    mutationFn: async (objectId: string) => {
      return catalogApi.syncFields(objectId)
    },
    onSuccess: (data) => {
      message.success(
        `Successfully synced fields! Total: ${data.totalFields}, Updated: ${data.updatedFields}, Created: ${data.createdFields}, Removed: ${data.removedFields}`
      )
      if (selectedObjectId) {
        queryClient.invalidateQueries({ queryKey: ['catalog-fields', selectedObjectId] })
      }
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to sync fields from Salesforce')
    },
  })

  // Toggle object selected mutation
  const toggleObjectSelectedMutation = useMutation({
    mutationFn: async ({ objectId, isSelected }: { objectId: string; isSelected: boolean }) => {
      return catalogApi.toggleObjectSelected(objectId, isSelected)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog-objects', sourceId] })
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to update object selection')
    },
  })

  // Save all field changes mutation
  const saveFieldChangesMutation = useMutation({
    mutationFn: async (changes: Record<string, boolean>) => {
      const selectFields: string[] = []
      const deselectFields: string[] = []

      Object.entries(changes).forEach(([fieldId, isSelected]) => {
        if (isSelected) {
          selectFields.push(fieldId)
        } else {
          deselectFields.push(fieldId)
        }
      })

      const promises: Promise<{ updatedCount: number; skippedCount: number }>[] = []
      
      if (selectFields.length > 0) {
        promises.push(catalogApi.bulkUpdateFieldsSelected(selectFields, true))
      }
      if (deselectFields.length > 0) {
        promises.push(catalogApi.bulkUpdateFieldsSelected(deselectFields, false))
      }

      const results = await Promise.all(promises)
      const totalUpdated = results.reduce((sum, r) => sum + r.updatedCount, 0)
      const totalSkipped = results.reduce((sum, r) => sum + r.skippedCount, 0)
      
      return { updatedCount: totalUpdated, skippedCount: totalSkipped }
    },
    onSuccess: (data) => {
      if (selectedObjectId) {
        queryClient.invalidateQueries({ queryKey: ['catalog-fields', selectedObjectId] })
        if (data.skippedCount > 0) {
          message.success(`Saved ${data.updatedCount} fields. ${data.skippedCount} required fields were skipped.`)
        } else {
          message.success(`Successfully saved ${data.updatedCount} field selections`)
        }
      }
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to save field selections')
    },
  })

  return {
    catalogData,
    fieldsData,
    fieldsLoading,
    fieldsError,
    syncObjectsMutation,
    syncFieldsMutation,
    toggleObjectSelectedMutation,
    saveFieldChangesMutation,
  }
}

