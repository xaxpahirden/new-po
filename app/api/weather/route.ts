import { NextResponse } from 'next/server'

const OWM_BASE = 'https://api.openweathermap.org/data/2.5/weather'

function error(message: string, status = 400, code = status) {
  return NextResponse.json({ error: { code, message } }, { status })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || undefined
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')
  const units = (searchParams.get('units') || 'metric').toLowerCase()

  if (!process.env.OPENWEATHER_API_KEY) {
    return error('服务器未配置 OPENWEATHER_API_KEY', 500)
  }

  if (!q && !(lat && lon)) {
    return error('需要提供城市名 (q) 或经纬度 (lat, lon)')
  }

  const url = new URL(OWM_BASE)
  url.searchParams.set('appid', process.env.OPENWEATHER_API_KEY)
  url.searchParams.set('lang', 'zh_cn')
  url.searchParams.set('units', units)
  if (q) url.searchParams.set('q', q)
  if (lat && lon) {
    url.searchParams.set('lat', lat)
    url.searchParams.set('lon', lon)
  }

  try {
    const res = await fetch(url.toString(), { cache: 'no-store' })
    const data = await res.json()
    if (!res.ok) {
      const message =
        res.status === 404
          ? '未找到该城市'
          : res.status === 429
          ? '请求过于频繁或配额不足'
          : data?.message || 'OpenWeatherMap 请求失败'
      return error(message, res.status)
    }
    return NextResponse.json(data, { status: 200 })
  } catch (e: any) {
    return error(e?.message || '网络错误', 500)
  }
}
