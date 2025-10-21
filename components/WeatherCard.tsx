import { CurrentWeather, Units, getOWMIconUrl, formatInTimezone } from '@/lib/weather'

export default function WeatherCard({ weather, units }: { weather: CurrentWeather; units: Units }) {
  const unitSymbol = units === 'metric' ? '°C' : '°F'
  const speedUnit = units === 'metric' ? 'm/s' : 'mph'
  const w = weather.weather[0]
  const tz = weather.timezone

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
        {weather.name}
        {weather.sys.country ? `, ${weather.sys.country}` : ''}
        <span className="ml-2">{formatInTimezone(weather.dt, tz, { hour: '2-digit', minute: '2-digit' })}</span>
      </div>

      <div className="flex items-center gap-4">
        {w?.icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={getOWMIconUrl(w.icon)} alt={w.description} className="h-16 w-16" />
        ) : null}
        <div>
          <div className="text-4xl font-semibold">
            {Math.round(weather.main.temp)}
            {unitSymbol}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            体感 {Math.round(weather.main.feels_like)}{unitSymbol} · {w?.description ?? ''}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800/60">
          <div className="text-xs text-gray-500">最低/最高</div>
          <div>
            {Math.round(weather.main.temp_min)} / {Math.round(weather.main.temp_max)} {unitSymbol}
          </div>
        </div>
        <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800/60">
          <div className="text-xs text-gray-500">风速</div>
          <div>
            {weather.wind?.speed ?? 0} {speedUnit}
          </div>
        </div>
        <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800/60">
          <div className="text-xs text-gray-500">湿度</div>
          <div>{weather.main.humidity}%</div>
        </div>
        <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800/60">
          <div className="text-xs text-gray-500">气压</div>
          <div>{weather.main.pressure} hPa</div>
        </div>
      </div>
    </div>
  )
}
