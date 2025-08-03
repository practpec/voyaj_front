import { useState } from 'react'

function App() {
  const [page, setPage] = useState('login')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-300 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Prueba de Layout</h1>
        <button
          onClick={() => setPage(page === 'login' ? 'dashboard' : 'login')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
        >
          {page === 'login' ? 'Ir a Dashboard' : 'Volver al Login'}
        </button>
        <p className="mt-4 text-gray-600">Página actual: {page}</p>
      </div>
    </div>
  )
}

export default App
