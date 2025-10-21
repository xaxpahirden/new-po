import { ForecastResponse, Units, getOWMIconUrl, groupForecastByDay } from '@/lib/weather'

export default function ForecastList({ forecast, units }: { forecast: ForecastResponse; units: Units }) {
  const unitSymbol = units === 'metric' ? '°C' : '°F'
  const days = groupForecastByDay(forecast).slice(0, 5)

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {days.map((d) => (
        <div key={d.dateKey} className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">{d.label}</div>
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getOWMIconUrl(d.icon)} alt={d.description} className="h-10 w-10" />
            <div className="text-xl font-medium">
              {Math.round(d.min)} / {Math.round(d.max)} {unitSymbol}
            </div>
          </div>
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">{d.description}</div>
        </div>
      ))}
    </div>
  )
}
