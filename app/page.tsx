"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import SearchBar from '@/components/SearchBar'
import UnitToggle, { readSavedUnits } from '@/components/UnitToggle'
import ErrorBanner from '@/components/ErrorBanner'
import WeatherCard from '@/components/WeatherCard'
import ForecastList from '@/components/ForecastList'
import { ForecastListSkeleton, WeatherCardSkeleton } from '@/components/LoadingSkeleton'
import type { CurrentWeather, ForecastResponse, Units } from '@/lib/weather'
import { fetchCurrentWeather, fetchForecast } from '@/lib/weather'

const AUTO_LOCATE_KEY = 'weather_auto_locate'

export default function HomePage() {
  const [units, setUnits] = useState<Units>('metric')
  const [autoLocate, setAutoLocate] = useState<boolean>(true)
  const [query, setQuery] = useState<string>('')
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [weather, setWeather] = useState<CurrentWeather | null>(null)
  const [forecast, setForecast] = useState<ForecastResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const geoAttemptedRef = useRef(false)
  const abortRef = useRef<AbortController | null>(null)

  // init units and auto-locate preference
  useEffect(() => {
    const saved = readSavedUnits()
    if (saved) setUnits(saved)
    try {
      const v = localStorage.getItem(AUTO_LOCATE_KEY)
      if (v === 'true' || v === 'false') setAutoLocate(v === 'true')
    } catch {}
  }, [])

  // persist auto-locate
  useEffect(() => {
    try {
      localStorage.setItem(AUTO_LOCATE_KEY, String(autoLocate))
    } catch {}
  }, [autoLocate])

  const doFetch = useCallback(
    async (params: { q?: string; lat?: number; lon?: number; units: Units }) => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      setLoading(true)
      setError(null)
      try {
        const [w, f] = await Promise.all([
          fetchCurrentWeather({ ...params, signal: controller.signal }),
          fetchForecast({ ...params, signal: controller.signal }),
        ])
        setWeather(w)
        setForecast(f)
      } catch (e: any) {
        setWeather(null)
        setForecast(null)
        setError(e?.message || '请求失败')
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // try geolocation once on mount or when turned on
  useEffect(() => {
    if (!autoLocate) return
    if (geoAttemptedRef.current) return
    if (typeof window === 'undefined' || !('geolocation' in navigator)) return

    geoAttemptedRef.current = true
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const c = { lat: latitude, lon: longitude }
        setCoords(c)
        setQuery('')
        doFetch({ ...c, units })
      },
      (err) => {
        setError(
          err?.code === 1
            ? '定位权限被拒绝，请手动搜索城市。'
            : '无法获取定位，请手动搜索城市。'
        )
      },
      { enableHighAccuracy: false, maximumAge: 60000, timeout: 8000 }
    )
  }, [autoLocate, doFetch, units])

  // when units change, refetch current target
  useEffect(() => {
    if (coords) doFetch({ ...coords, units })
    else if (query) doFetch({ q: query, units })
  }, [units])

  const onSearch = (q: string) => {
    setQuery(q)
    setCoords(null)
    doFetch({ q, units })
  }

  const onToggleAutoLocate = (v: boolean) => {
    setAutoLocate(v)
    if (v) {
      // trigger geolocation attempt again
      geoAttemptedRef.current = false
    }
  }

  const showResult = weather && forecast

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar onSearch={onSearch} />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="auto-locate" className="text-gray-600 dark:text-gray-300">
              自动定位
            </label>
            <input
              id="auto-locate"
              type="checkbox"
              checked={autoLocate}
              onChange={(e) => onToggleAutoLocate(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
          </div>
          <UnitToggle units={units} onChange={setUnits} />
        </div>
      </div>

      {error ? <ErrorBanner message={error} onClose={() => setError(null)} /> : null}

      {loading && !showResult ? (
        <>
          <WeatherCardSkeleton />
          <ForecastListSkeleton />
        </>
      ) : null}

      {showResult ? (
        <div className="space-y-4">
          {weather ? <WeatherCard weather={weather} units={units} /> : null}
          {forecast ? <ForecastList forecast={forecast} units={units} /> : null}
        </div>
      ) : (
        !loading && (
          <div className="rounded-md border border-dashed p-6 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
            请输入城市名进行搜索，或开启自动定位以获取当前位置天气。
          </div>
        )
      )}
    </div>
  )
}
