import { useState } from 'react'

function CreateTripModal({ onClose, onTripCreated }) {
  const [form, setForm] = useState({
    title: '',
    start_date: '',
    end_date: '',
    base_currency: 'MXN',
    estimated_total_budget: '',
    is_public: false
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const currencies = [
    { code: 'MXN', name: 'Peso Mexicano', symbol: '$' },
    { code: 'USD', name: 'Dólar Americano', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'Libra Esterlina', symbol: '£' },
    { code: 'CAD', name: 'Dólar Canadiense', symbol: 'C$' },
    { code: 'AUD', name: 'Dólar Australiano', symbol: 'A$' },
    { code: 'JPY', name: 'Yen Japonés', symbol: '¥' },
    { code: 'CHF', name: 'Franco Suizo', symbol: 'CHF' }
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!form.title.trim()) {
      newErrors.title = 'Título es requerido'
    } else if (form.title.length < 3) {
      newErrors.title = 'Mínimo 3 caracteres'
    } else if (form.title.length > 100) {
      newErrors.title = 'Máximo 100 caracteres'
    }

    if (!form.start_date) {
      newErrors.start_date = 'Fecha de inicio es requerida'
    }
    
    if (!form.end_date) {
      newErrors.end_date = 'Fecha de fin es requerida'
    }

    if (form.start_date && form.end_date) {
      const startDate = new Date(form.start_date)
      const endDate = new Date(form.end_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (startDate < today) {
        newErrors.start_date = 'La fecha no puede ser en el pasado'
      }
      
      if (endDate <= startDate) {
        newErrors.end_date = 'Debe ser posterior a la fecha de inicio'
      }
    }

    if (form.estimated_total_budget) {
      const budget = parseFloat(form.estimated_total_budget)
      if (isNaN(budget)) {
        newErrors.estimated_total_budget = 'Debe ser un número válido'
      } else if (budget < 0) {
        newErrors.estimated_total_budget = 'Debe ser un valor positivo'
      } else if (budget > 1000000) {
        newErrors.estimated_total_budget = 'Máximo $1,000,000'
      }
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const tripData = {
        ...form,
        estimated_total_budget: form.estimated_total_budget ? parseFloat(form.estimated_total_budget) : null
      }
      
      // Llamada real al API
      const response = await fetch('http://localhost:8000/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')?.replace(/^["']|["']$/g, '').trim()}`
        },
        body: JSON.stringify(tripData)
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData)
      }

      const createdTrip = await response.json()
      console.log('[TRIP_CREATED]', createdTrip)
      
      onTripCreated?.()
      onClose?.()
    } catch (error) {
      console.error('[CREATE_TRIP_ERROR]', error)
      if (error.message.includes('PRO subscription required')) {
        setErrors({ general: 'Plan FREE permite solo 1 viaje. Actualiza a PRO para viajes ilimitados.' })
      } else {
        setErrors({ general: `Error al crear viaje: ${error.message}` })
      }
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateDuration = () => {
    if (!form.start_date || !form.end_date) return null
    const start = new Date(form.start_date)
    const end = new Date(form.end_date)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Crear Nuevo Viaje</h2>
                <p className="text-gray-600">Planifica tu próxima aventura</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-8 py-6">
          {/* Alerta de información */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-blue-800 text-sm font-medium">Información básica del viaje</p>
                <p className="text-blue-700 text-sm">Completa estos datos para crear tu viaje. Podrás agregar más detalles después.</p>
              </div>
            </div>
          </div>

          {/* Error general */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 text-sm font-medium">{errors.general}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Título del viaje */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                Título del viaje *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  placeholder="ej. Aventura en Europa"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={`w-full h-12 px-4 pr-12 bg-white border rounded-xl transition-all duration-200 text-gray-900 placeholder-gray-500
                    ${errors.title 
                      ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100' 
                      : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                    } focus:outline-none`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="start_date" className="block text-sm font-semibold text-gray-900 mb-2">
                  Fecha de inicio *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="start_date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full h-12 px-4 pr-12 bg-white border rounded-xl transition-all duration-200 text-gray-900
                      ${errors.start_date 
                        ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100' 
                        : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                      } focus:outline-none`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                {form.start_date && (
                  <p className="text-gray-600 text-xs mt-1">{formatDate(form.start_date)}</p>
                )}
                {errors.start_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
                )}
              </div>

              <div>
                <label htmlFor="end_date" className="block text-sm font-semibold text-gray-900 mb-2">
                  Fecha de fin *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="end_date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    min={form.start_date || new Date().toISOString().split('T')[0]}
                    className={`w-full h-12 px-4 pr-12 bg-white border rounded-xl transition-all duration-200 text-gray-900
                      ${errors.end_date 
                        ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100' 
                        : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                      } focus:outline-none`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                {form.end_date && (
                  <p className="text-gray-600 text-xs mt-1">{formatDate(form.end_date)}</p>
                )}
                {errors.end_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
                )}
              </div>
            </div>

            {/* Duración calculada */}
            {calculateDuration() && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-800 font-medium text-sm">
                    Duración: {calculateDuration()} {calculateDuration() === 1 ? 'día' : 'días'}
                  </span>
                </div>
              </div>
            )}

            {/* Moneda base */}
            <div>
              <label htmlFor="base_currency" className="block text-sm font-semibold text-gray-900 mb-2">
                Moneda base
              </label>
              <div className="relative">
                <select
                  id="base_currency"
                  value={form.base_currency}
                  onChange={(e) => setForm({ ...form, base_currency: e.target.value })}
                  className="w-full h-12 px-4 pr-12 bg-white border border-gray-300 rounded-xl transition-all duration-200 text-gray-900 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none appearance-none"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Presupuesto estimado */}
            <div>
              <label htmlFor="estimated_total_budget" className="block text-sm font-semibold text-gray-900 mb-2">
                Presupuesto estimado <span className="text-gray-500 font-normal">(opcional)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="estimated_total_budget"
                  placeholder="0.00"
                  value={form.estimated_total_budget}
                  onChange={(e) => setForm({ ...form, estimated_total_budget: e.target.value })}
                  min="0"
                  step="0.01"
                  className={`w-full h-12 px-4 pl-12 bg-white border rounded-xl transition-all duration-200 text-gray-900 placeholder-gray-500
                    ${errors.estimated_total_budget 
                      ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100' 
                      : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                    } focus:outline-none`}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="text-gray-500 font-medium">
                    {currencies.find(c => c.code === form.base_currency)?.symbol}
                  </span>
                </div>
              </div>
              {errors.estimated_total_budget && (
                <p className="text-red-500 text-sm mt-1">{errors.estimated_total_budget}</p>
              )}
            </div>

            {/* Visibilidad */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={form.is_public}
                  onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
                  className="mt-1 w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div>
                  <label htmlFor="is_public" className="block text-sm font-medium text-gray-900 cursor-pointer">
                    Hacer público el viaje
                  </label>
                  <p className="text-gray-600 text-xs mt-1">
                    Los viajes públicos pueden ser vistos por otros usuarios en la comunidad
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-8 py-6 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Creando...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Crear Viaje</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateTripModal