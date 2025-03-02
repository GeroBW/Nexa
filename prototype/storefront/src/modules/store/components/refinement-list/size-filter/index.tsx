"use client"

import * as React from "react"
import { MetadataFilter } from "types/metaDataFilter"
import { Button, Group, Input, Label, NumberField, Text } from "react-aria-components"
import { updateSizingData } from "@lib/data/cart"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { set } from "lodash"

const SIZING_OPTIONS = {
  chest_cm: "Chest",
  waist_cm: "Waist",
  back_length_cm: "Back Length",
  front_length_cm: "Front Length",
  sleeve_length_cm: "Sleeve Length"
} as const

type SizingKey = keyof typeof SIZING_OPTIONS

export const SizeFilter: React.FC<{
  sizingData: MetadataFilter
  setSizingData: React.Dispatch<React.SetStateAction<MetadataFilter>>
}> = ({ sizingData, setSizingData }) => {
  const [pendingChanges, setPendingChanges] = React.useState<MetadataFilter>({})

  const handleSizeChange = (key: SizingKey, value: number | undefined) => {
    setPendingChanges(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveChanges = async (key?: SizingKey) => {
    if (!Object.keys(pendingChanges).length) return

    const updatedData = {
      ...sizingData,
      ...(key ? { [key]: pendingChanges[key] } : pendingChanges)
    }

    await updateSizingData({ sizingData: updatedData })
    setSizingData(updatedData)
    setPendingChanges({})
  }

  const handleKeyDown = (key: SizingKey, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSaveChanges(key)
    }
  }

  const handleClearSize = async (key: SizingKey) => {
    const updatedData = {
      ...sizingData,
      ...(key ? { [key]: null } : {})
    }

    console.log(updatedData)
    console.log(sizingData)
    await updateSizingData({ sizingData: updatedData })
    setSizingData(updatedData)
    console.log(sizingData)
    setPendingChanges({})
  }

  return (
    <div className="flex flex-col gap-4">
      <Label className="text-md font-semibold">Sizing</Label>
      <Group className="flex flex-col gap-2">
        {Object.entries(SIZING_OPTIONS).map(([key, label]) => {
          let value = pendingChanges[key as SizingKey] ?? sizingData[key as SizingKey]
          const isSet = value !== undefined || value !== null

          if (!isSet) {
            return (
              <Button
                key={key}
                onPress={() => handleSizeChange(key as SizingKey, 0)}
                className="text-left px-2 py-1 hover:bg-gray-100 rounded"
              >
                <Text>{label}</Text>
              </Button>
            )
          }

          return (
            <div key={key} className="flex items-center gap-2">
              <NumberField
                value={value}
                onChange={(val) => handleSizeChange(key as SizingKey, val)}
                onBlur={() => handleSaveChanges(key as SizingKey)}
                onKeyDown={(e) => handleKeyDown(key as SizingKey, e)}
                className="flex flex-col gap-1"
                formatOptions={{
                  maximumFractionDigits: 1,
                  minimumFractionDigits: 0
                }}
              >
                {state => (
                  <Group className="flex border rounded focus-within:border-black">
                    <Label className="px-2 py-1 bg-gray-50 text-sm">
                      {label}
                    </Label>
                    <Input
                      className="px-2 py-1 w-24 outline-none"
                    />
                    <div className="flex flex-col">
                    </div>
                  </Group>
                )}
              </NumberField>
              <Button
                onPress={() => {
                  // handleSizeChange(key as SizingKey, 0)
                  setPendingChanges(prev => {
                    const next = { ...prev }
                    set(next, key, undefined)
                    return next
                  })
                  // value = 0;
                  handleClearSize(key as SizingKey);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ✕
              </Button>
            </div>
          )
        })}
      </Group>
      <SubmitButton
        className="mt-6"
        onPress={() => handleSaveChanges()}
      >
        Apply Sizing
      </SubmitButton>
    </div>
  )
}