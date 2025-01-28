"use client"

import React, { useState } from "react"
import { MetadataFilter } from "types/metaDataFilter"

const availableFilters = [
  { label: "Chest (cm)", key: "chest_cm" },
  { label: "Waist (cm)", key: "waist_cm" },
  { label: "Back Length (cm)", key: "back_length_cm" },
  { label: "Front Length (cm)", key: "front_length_cm" },
  { label: "Sleeve Length (cm)", key: "sleeve_length_cm" },
]

const SizingFilterForm = ({ onSubmit }: { onSubmit: (filters: MetadataFilter) => void }) => {
  const [filters, setFilters] = useState<MetadataFilter>({})
  const [selectedFilter, setSelectedFilter] = useState<string>("")

  const handleAddFilter = () => {
    if (selectedFilter && !filters[selectedFilter]) {
      setFilters({ ...filters, [selectedFilter]: undefined })
      setSelectedFilter("")
    }
  }

  const handleFilterChange = (key: string, value: number) => {
    setFilters({ ...filters, [key]: value })
  }

  const handleRemoveFilter = (key: string) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    setFilters(newFilters)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(filters)
    // Refresh the page or re-fetch products with the new filters
  }

  const availableOptions = availableFilters.filter(f => !filters[f.key])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-4">
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select filter</option>
          {availableOptions.map((filter) => (
            <option key={filter.key} value={filter.key}>
              {filter.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAddFilter}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Filter
        </button>
      </div>

      {Object.keys(filters).map((key) => (
        <div key={key} className="flex items-center space-x-4">
          <label className="flex-1">
            {availableFilters.find(f => f.key === key)?.label}
            <input
              type="number"
              value={filters[key] || ""}
              onChange={(e) => handleFilterChange(key, Number(e.target.value))}
              className="border p-2 rounded w-full"
            />
          </label>
          <button
            type="button"
            onClick={() => handleRemoveFilter(key)}
            className="bg-red-500 text-white p-2 rounded"
          >
            Remove
          </button>
        </div>
      ))}

      <button type="submit" className="bg-green-500 text-white p-2 rounded">
        Apply Filters
      </button>
    </form>
  )
}

export default SizingFilterForm
