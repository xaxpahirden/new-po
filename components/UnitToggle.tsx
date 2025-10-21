"use client"

import { useEffect } from 'react'
import type { Units } from '@/lib/weather'

const STORAGE_KEY = 'weather_units'

export default function UnitToggle({ units, onChange }: { units: Units; onChange: (u: Units) => void }) {
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, units)
    } catch {}
  }, [units])

  return (
    <div className="inline-flex select-none items-center overflow-hidden rounded-md border bg-white text-sm dark:border-gray-700 dark:bg-gray-900">
      <button
        className={`px-3 py-2 ${units === 'metric' ? 'bg-primary text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
        onClick={() => onChange('metric')}
        aria-pressed={units === 'metric'}
        aria-label="切换到摄氏度"
      >
        °C
      </button>
      <button
        className={`px-3 py-2 ${units === 'imperial' ? 'bg-primary text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
        onClick={() => onChange('imperial')}
        aria-pressed={units === 'imperial'}
        aria-label="切换到华氏度"
      >
        °F
      </button>
    </div>
  )
}

export function readSavedUnits(): Units | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'metric' || v === 'imperial') return v
  } catch {}
  return null
}
