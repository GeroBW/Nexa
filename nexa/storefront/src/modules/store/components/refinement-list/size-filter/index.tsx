"use client"

import * as React from "react"
import { MetadataFilter } from "types/metaDataFilter"
import { Label } from "react-aria-components"
import { updateSizingData } from "@lib/data/cart"


export const SizeFilter: React.FC<{
  sizingData: MetadataFilter
}> = ({ sizingData }) => {
  const handleSizingSubmit = async (formData: FormData) => {
    const sizingData: MetadataFilter = {
      chest_cm: formData.get("chest_cm") ? parseFloat(formData.get("chest_cm") as string) : undefined,
      waist_cm: formData.get("waist_cm") ? parseFloat(formData.get("waist_cm") as string) : undefined,
      back_length_cm: formData.get("back_length_cm") ? parseFloat(formData.get("back_length_cm") as string) : undefined,
      front_length_cm: formData.get("front_length_cm") ? parseFloat(formData.get("front_length_cm") as string) : undefined,
      sleeve_length_cm: formData.get("sleeve_length_cm") ? parseFloat(formData.get("sleeve_length_cm") as string) : undefined,
    }

    await updateSizingData({ sizingData })
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        await handleSizingSubmit(formData)

        close()
      }}
    >

      <div className="flex flex-col">
        <Label className="block text-md font-semibold mb-3">
          Sizing
        </Label>
        <div className="flex flex-col gap-4">
          {Object.entries(sizingData).map(([key, value]) => (
            <div key={key}>
              <label htmlFor={key}>{key.replace('_', ' ')}:</label>
              <input
                type="number"
                id={key}
                name={key}
                className="w-full border border-gray-300 rounded-md p-2"
                defaultValue={value || ""}
              />
            </div>
          ))}
        </div>
      </div>
      <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
        Apply
      </button>
    </form>
  )
}
