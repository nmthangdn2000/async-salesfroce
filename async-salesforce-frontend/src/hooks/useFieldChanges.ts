import { useState, useEffect, useCallback } from 'react'
import type { CatalogField } from '@/services/catalog.service'

export function useFieldChanges(
  fieldsData: CatalogField[] | undefined,
  selectedObjectId: string | null
) {
  const [fieldChanges, setFieldChanges] = useState<Record<string, boolean>>({})

  // Reset field changes when object changes
  useEffect(() => {
    setFieldChanges({})
  }, [selectedObjectId])

  const handleFieldChange = useCallback((fieldId: string, isSelected: boolean) => {
    setFieldChanges((prev) => ({
      ...prev,
      [fieldId]: isSelected,
    }))
  }, [])

  const handleSelectAllFields = useCallback(() => {
    if (fieldsData) {
      const newChanges = { ...fieldChanges }
      fieldsData.forEach((field) => {
        const currentState = fieldChanges[field.id] !== undefined ? fieldChanges[field.id] : field.isSelected
        if (!currentState) {
          newChanges[field.id] = true
        }
      })
      setFieldChanges(newChanges)
    }
  }, [fieldsData, fieldChanges])

  const handleDeselectAllFields = useCallback(() => {
    if (fieldsData) {
      const newChanges = { ...fieldChanges }
      fieldsData.forEach((field) => {
        if (!field.isRequired) {
          const currentState = fieldChanges[field.id] !== undefined ? fieldChanges[field.id] : field.isSelected
          if (currentState) {
            newChanges[field.id] = false
          }
        }
      })
      setFieldChanges(newChanges)
    }
  }, [fieldsData, fieldChanges])

  const handleCancelFieldChanges = useCallback(() => {
    setFieldChanges({})
  }, [])

  return {
    fieldChanges,
    setFieldChanges,
    handleFieldChange,
    handleSelectAllFields,
    handleDeselectAllFields,
    handleCancelFieldChanges,
  }
}

