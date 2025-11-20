import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo, useCallback } from 'react'
import { Empty, Spin, Card, message } from 'antd'
import { AuthType } from '@/types/source-setting'
import { SourceHeader } from '@/components/source-detail/SourceHeader'
import { CatalogSection } from '@/components/source-detail/CatalogSection'
import { SettingsDrawer } from '@/components/source-detail/SettingsDrawer'
import { OAuthDrawer } from '@/components/source-detail/OAuthDrawer'
import { useSourceDetail } from '@/hooks/useSourceDetail'
import { useCatalog } from '@/hooks/useCatalog'
import { useOAuth } from '@/hooks/useOAuth'
import { useFieldChanges } from '@/hooks/useFieldChanges'

export const Route = createFileRoute('/sources/$id')({
  component: SourceDetailPage,
})

function SourceDetailPage() {
  const { id } = Route.useParams()
  const [isSettingDrawerOpen, setIsSettingDrawerOpen] = useState(false)
  const [isOAuthDrawerOpen, setIsOAuthDrawerOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null)
  const [objectSearch, setObjectSearch] = useState<string>('')
  const [objectFilterSelected, setObjectFilterSelected] = useState<boolean | undefined>(undefined)
  const [fieldSearch, setFieldSearch] = useState<string>('')
  const [fieldFilterSelected, setFieldFilterSelected] = useState<boolean | undefined>(undefined)

  // Custom hooks
  const {
    source,
    sourceLoading,
    project,
    sourceSetting,
    isConnected,
    saveSettingMutation,
  } = useSourceDetail(id)

  const {
    catalogData,
    fieldsData,
    fieldsLoading,
    fieldsError,
    syncObjectsMutation,
    syncFieldsMutation,
    toggleObjectSelectedMutation,
    saveFieldChangesMutation,
  } = useCatalog(id, selectedObjectId, objectSearch, objectFilterSelected, fieldSearch, fieldFilterSelected)

  const { fieldChanges, handleFieldChange, handleSelectAllFields, handleDeselectAllFields, handleCancelFieldChanges } = useFieldChanges(fieldsData?.items, selectedObjectId)

  const { getCallbackUrl, handleAuthenticate } = useOAuth(id, sourceSetting || undefined)

  // Handlers
  const handleOpenSettingModal = useCallback(() => setIsSettingDrawerOpen(true), [])
  const handleOpenOAuthModal = useCallback(() => setIsOAuthDrawerOpen(true), [])
  const handleCloseSettingDrawer = useCallback(() => setIsSettingDrawerOpen(false), [])
  const handleCloseOAuthDrawer = useCallback(() => setIsOAuthDrawerOpen(false), [])

  const handleSaveSetting = useCallback(async (values: {
    instanceUrl: string
    authType: AuthType
    scopes?: string[]
    clientId?: string
    clientSecret?: string
    refreshToken?: string
  }) => {
    try {
      await saveSettingMutation.mutateAsync(values)
      message.success(
        sourceSetting
          ? 'Source setting updated successfully'
          : 'Source setting created successfully',
      )
      setIsSettingDrawerOpen(false)
    } catch (error) {
      // Error is already handled in mutation onError
    }
  }, [saveSettingMutation, sourceSetting])

  const handleCopyCallbackUrl = useCallback(async () => {
    try {
      const callbackUrl = getCallbackUrl()
      await navigator.clipboard.writeText(callbackUrl)
      setIsCopied(true)
      message.success('Callback URL copied to clipboard!')
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      message.error('Failed to copy URL')
    }
  }, [getCallbackUrl])

  const handleSaveRefreshToken = useCallback(async (refreshToken: string) => {
    if (!sourceSetting) {
      message.error('Please save settings first')
      return
    }
    await saveSettingMutation.mutateAsync({
      instanceUrl: sourceSetting.instanceUrl,
      authType: sourceSetting.authType,
      scopes: sourceSetting.scopes,
      clientId: sourceSetting.clientId,
      refreshToken,
    })
  }, [sourceSetting, saveSettingMutation])

  const handleObjectSelect = useCallback((objectId: string) => setSelectedObjectId(objectId), [])
  const handleObjectToggle = useCallback((objectId: string, isSelected: boolean) => {
    toggleObjectSelectedMutation.mutate({ objectId, isSelected })
  }, [toggleObjectSelectedMutation])
  const handleObjectSearchChange = useCallback((search: string) => setObjectSearch(search), [])
  const handleObjectFilterChange = useCallback((filter: boolean | undefined) => setObjectFilterSelected(filter), [])
  const handleObjectsSync = useCallback(() => syncObjectsMutation.mutate(), [syncObjectsMutation])

  const handleSaveFieldChanges = useCallback(() => {
    saveFieldChangesMutation.mutate(fieldChanges)
  }, [saveFieldChangesMutation, fieldChanges])
  const handleFieldSearchChange = useCallback((search: string) => setFieldSearch(search), [])
  const handleFieldFilterChange = useCallback((filter: boolean | undefined) => setFieldFilterSelected(filter), [])
  const handleFieldsSync = useCallback(() => {
    if (selectedObjectId) syncFieldsMutation.mutate(selectedObjectId)
  }, [selectedObjectId, syncFieldsMutation])

  // Memoized data - MUST be before any early returns (Rules of Hooks)
  const catalogObjects = useMemo(() => catalogData?.items || [], [catalogData?.items])
  const catalogFields = useMemo(() => fieldsData?.items || [], [fieldsData?.items])

  if (sourceLoading) {
    return (
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!source) {
    return (
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
        <Card>
          <Empty
            description="Source not found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <SourceHeader
        source={source}
        projectName={project?.name}
        isConnected={isConnected}
        onOpenSettings={handleOpenSettingModal}
        onOpenOAuth={handleOpenOAuthModal}
      />

      <CatalogSection
        objects={catalogObjects}
        objectsTotal={catalogData?.meta.totalItems || 0}
        selectedObjectId={selectedObjectId}
        objectSearch={objectSearch}
        objectFilterSelected={objectFilterSelected}
        fields={catalogFields}
        fieldsTotal={fieldsData?.meta.totalItems || 0}
        fieldSearch={fieldSearch}
        fieldFilterSelected={fieldFilterSelected}
        fieldChanges={fieldChanges}
        isObjectsSyncing={syncObjectsMutation.isPending}
        isFieldsLoading={fieldsLoading}
        isFieldsSyncing={syncFieldsMutation.isPending}
        isSavingFields={saveFieldChangesMutation.isPending}
        fieldsError={fieldsError}
        canSync={isConnected}
        onObjectSelect={handleObjectSelect}
        onObjectToggle={handleObjectToggle}
        onObjectSearchChange={handleObjectSearchChange}
        onObjectFilterChange={handleObjectFilterChange}
        onObjectsSync={handleObjectsSync}
        onFieldChange={handleFieldChange}
        onSelectAllFields={handleSelectAllFields}
        onDeselectAllFields={handleDeselectAllFields}
        onSaveFieldChanges={handleSaveFieldChanges}
        onCancelFieldChanges={handleCancelFieldChanges}
        onFieldSearchChange={handleFieldSearchChange}
        onFieldFilterChange={handleFieldFilterChange}
        onFieldsSync={handleFieldsSync}
      />

      <SettingsDrawer
        open={isSettingDrawerOpen}
        sourceSetting={sourceSetting || undefined}
        isCopied={isCopied}
        isSaving={saveSettingMutation.isPending}
        onClose={handleCloseSettingDrawer}
        onSave={handleSaveSetting}
        onCopyCallbackUrl={handleCopyCallbackUrl}
        getCallbackUrl={getCallbackUrl}
      />

      <OAuthDrawer
        open={isOAuthDrawerOpen}
        sourceSetting={sourceSetting || undefined}
        isSaving={saveSettingMutation.isPending}
        onClose={handleCloseOAuthDrawer}
        onAuthenticate={handleAuthenticate}
        onSaveRefreshToken={handleSaveRefreshToken}
      />
    </div>
  )
}
