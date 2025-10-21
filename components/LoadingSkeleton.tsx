export function WeatherCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 h-5 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="mb-2 h-10 w-1/5 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="mb-2 h-4 w-2/5 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 rounded bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
    </div>
  )
}

export function ForecastListSkeleton() {
  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mb-3 h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mb-2 h-8 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      ))}
    </div>
  )
}
