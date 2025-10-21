type Props = {
  message: string
  onClose?: () => void
}

export default function ErrorBanner({ message, onClose }: Props) {
  return (
    <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 text-sm">{message}</div>
        {onClose ? (
          <button
            className="rounded p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40"
            onClick={onClose}
            aria-label="关闭错误提示"
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  )
}
