"use client"

import { useState } from 'react'

export default function SearchBar({
  defaultValue = '',
  onSearch,
}: {
  defaultValue?: string
  onSearch: (q: string) => void
}) {
  const [q, setQ] = useState(defaultValue)

  return (
    <form
      className="flex w-full items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (q.trim()) onSearch(q.trim())
      }}
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="输入城市名（中文或英文），例如：北京 / Shanghai"
        className="h-11 w-full flex-1 rounded-md border px-3 shadow-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900"
        aria-label="搜索城市"
      />
      <button
        type="submit"
        className="h-11 rounded-md bg-primary px-4 text-white shadow hover:bg-primary-dark"
        aria-label="搜索"
      >
        搜索
      </button>
    </form>
  )
}
