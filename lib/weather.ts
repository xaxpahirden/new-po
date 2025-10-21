export type Units = 'metric' | 'imperial'

export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface CurrentWeather {
  coord: { lon: number; lat: number }
  weather: WeatherCondition[]
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  wind: { speed: number }
  sys: { country?: string | undefined; sunrise?: number; sunset?: number }
  name: string
  dt: number
  timezone: number // seconds offset from UTC
}

export interface ForecastItem {
  dt: number
  main: { temp: number; temp_min: number; temp_max: number }
  weather: WeatherCondition[]
  wind: { speed: number }
  dt_txt?: string
}

export interface ForecastResponse {
  cod: string
  message: number
  cnt: number
  list: ForecastItem[]
  city: {
    id: number
    name: string
    country: string
    timezone: number
    sunrise?: number
    sunset?: number
    coord: { lat: number; lon: number }
  }
}

export interface APIError {
  error: { code: number; message: string }
}

export function getOWMIconUrl(icon: string, big = true) {
  return `https://openweathermap.org/img/wn/${icon}${big ? '@2x' : ''}.png`
}

export function formatInTimezone(
  unixSeconds: number,
  timezoneOffsetSeconds: number,
  options: Intl.DateTimeFormatOptions
) {
  const date = new Date((unixSeconds + timezoneOffsetSeconds) * 1000)
  return new Intl.DateTimeFormat('zh-CN', options).format(date)
}

export function groupForecastByDay(
  forecast: ForecastResponse
): Array<{
  dateKey: string
  label: string
  min: number
  max: number
  items: ForecastItem[]
  icon: string
  description: string
}> {
  const tz = forecast.city.timezone
  const groups: Record<string, ForecastItem[]> = {}

  for (const item of forecast.list) {
    const d = new Date((item.dt + tz) * 1000)
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  }

  const result = Object.entries(groups)
    .map(([key, items]) => {
      const temps = items.map((i) => i.main)
      const min = Math.min(...temps.map((t) => t.temp_min))
      const max = Math.max(...temps.map((t) => t.temp_max))

      // Pick icon from the middle of the day if available, else first
      const mid = items[Math.floor(items.length / 2)] || items[0]
      const icon = mid.weather[0]?.icon ?? items[0].weather[0]?.icon ?? '01d'
      const description = mid.weather[0]?.description ?? ''

      const first = items[0]
      const label = formatInTimezone(first.dt, tz, {
        month: 'numeric',
        day: 'numeric',
        weekday: 'short',
      })

      return { dateKey: key, label, min, max, items, icon, description }
    })
    // sort by date
    .sort((a, b) => {
      const [ay, am, ad] = a.dateKey.split('-').map(Number)
      const [by, bm, bd] = b.dateKey.split('-').map(Number)
      return new Date(ay, am - 1, ad).getTime() - new Date(by, bm - 1, bd).getTime()
    })

  return result
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json()
  if (!res.ok) {
    const err = (data as APIError)?.error
    throw new Error(err?.message || '请求失败')
  }
  return data as T
}

export async function fetchCurrentWeather(params: {
  q?: string
  lat?: number
  lon?: number
  units: Units
  signal?: AbortSignal
}): Promise<CurrentWeather> {
  const url = new URL('/api/weather', typeof window === 'undefined' ? 'http://localhost' : window.location.origin)
  if (params.q) url.searchParams.set('q', params.q)
  if (params.lat != null && params.lon != null) {
    url.searchParams.set('lat', String(params.lat))
    url.searchParams.set('lon', String(params.lon))
  }
  url.searchParams.set('units', params.units)
  const res = await fetch(url.toString(), { signal: params.signal, cache: 'no-store' })
  return handleResponse<CurrentWeather>(res)
}

export async function fetchForecast(params: {
  q?: string
  lat?: number
  lon?: number
  units: Units
  signal?: AbortSignal
}): Promise<ForecastResponse> {
  const url = new URL('/api/forecast', typeof window === 'undefined' ? 'http://localhost' : window.location.origin)
  if (params.q) url.searchParams.set('q', params.q)
  if (params.lat != null && params.lon != null) {
    url.searchParams.set('lat', String(params.lat))
    url.searchParams.set('lon', String(params.lon))
  }
  url.searchParams.set('units', params.units)
  const res = await fetch(url.toString(), { signal: params.signal, cache: 'no-store' })
  return handleResponse<ForecastResponse>(res)
}
