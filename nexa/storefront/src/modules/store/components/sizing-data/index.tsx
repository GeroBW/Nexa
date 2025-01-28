"use client"

import { useState } from "react"
import { MetadataFilter } from "types/metaDataFilter"
import { updateSizingData } from "@lib/data/cart"

type SizingDataProps = {
  initialSizingData: MetadataFilter
}

const SizingData = ({ initialSizingData }: SizingDataProps) => {
  const [sizingData, setSizingData] = useState<MetadataFilter>(initialSizingData)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSizingData((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(sizingData)
    const res = await updateSizingData({ sizingData })
    console.log(res)
    console.log("Sizing data updated")
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="chest_cm">Chest (cm):</label>
        <input
          type="number"
          id="chest_cm"
          name="chest_cm"
          value={sizingData.chest_cm || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="waist_cm">Waist (cm):</label>
        <input
          type="number"
          id="waist_cm"
          name="waist_cm"
          value={sizingData.waist_cm || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="back_length_cm">Back Length (cm):</label>
        <input
          type="number"
          id="back_length_cm"
          name="back_length_cm"
          value={sizingData.back_length_cm || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="front_length_cm">Front Length (cm):</label>
        <input
          type="number"
          id="front_length_cm"
          name="front_length_cm"
          value={sizingData.front_length_cm || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="sleeve_length_cm">Sleeve Length (cm):</label>
        <input
          type="number"
          id="sleeve_length_cm"
          name="sleeve_length_cm"
          value={sizingData.sleeve_length_cm || ""}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Update Sizing Data</button>
    </form>
  )
}

export default SizingData
