import * as React from "react"

const SizeVariable: React.FC<{ name: string, value: number | undefined }> = ({ name, value }) => {
  return (
    <div>
      <label htmlFor={name}>{name.replace('_', ' ')}:</label>
      <input
        type="number"
        id={name}
        name={name}
        className="w-full border border-gray-300 rounded-md p-2"
        defaultValue={value || ""}
      />
    </div>
  )
}

export default SizeVariable
