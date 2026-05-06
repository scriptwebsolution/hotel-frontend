import React from "react";

export default function TableToolbar({ title, onSearch }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-ink-600">Show</span>
        <select className="border border-ink-200 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-brand-500">
          <option>10</option>
          <option>25</option>
          <option>50</option>
          <option>100</option>
        </select>
        <span className="text-sm text-ink-600">entries</span>
      </div>

      <div className="flex items-center gap-2">
        <button className="px-3 py-1 text-xs font-medium bg-[#28a745] hover:bg-[#218838] text-white rounded transition">Copy</button>
        <button className="px-3 py-1 text-xs font-medium bg-[#28a745] hover:bg-[#218838] text-white rounded transition">CSV</button>
        <button className="px-3 py-1 text-xs font-medium bg-[#28a745] hover:bg-[#218838] text-white rounded transition">PDF</button>
        <button className="px-3 py-1 text-xs font-medium bg-[#28a745] hover:bg-[#218838] text-white rounded transition">Print</button>
        <button className="px-3 py-1 text-xs font-medium bg-[#28a745] hover:bg-[#218838] text-white rounded transition">Column visibility</button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-ink-600">Search:</label>
        <input 
          type="text" 
          onChange={(e) => onSearch && onSearch(e.target.value)}
          className="border border-ink-200 rounded px-3 py-1 text-sm focus:outline-none focus:border-brand-500"
        />
      </div>
    </div>
  );
}
