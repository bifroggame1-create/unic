export function ErrorState({
  title = 'Ошибка загрузки',
  message = 'Не удалось загрузить данные',
  onRetry
}: any) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div className="text-8xl mb-6 animate-bounce">😢</div>
      <h2 className="text-2xl font-bold mb-3 text-center">{title}</h2>
      <p className="text-sm text-gray-500 mb-8 text-center max-w-sm">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600
                   text-white font-bold rounded-2xl shadow-xl
                   active:scale-95 transition-transform"
          style={{ minHeight: '56px' }}
        >
          Попробовать снова
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-4 bg-gray-100 text-gray-700 font-medium rounded-2xl
                   active:scale-95 transition-transform"
        >
          На главную
        </button>
      </div>
    </div>
  )
}
