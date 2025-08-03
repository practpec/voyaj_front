import { useState, useEffect } from 'react'
import { tripsService } from '../services/api/tripsService.js'
import { subscriptionsService } from '../services/api/subscriptionsService.js'
import CreateTripModal from '../components/CreateTripModal.jsx'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'

function Dashboard({ user, onNavigate, onLogout }) {
  const [trips, setTrips] = useState([])
  const [subscription, setSubscription] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const token = localStorage.getItem('access_token')
      console.log('[DASHBOARD] Token check:', { 
        hasToken: !!token, 
        tokenPreview: token?.substring(0, 20) + '...' 
      })
      
      const [tripsData, subData] = await Promise.all([
        tripsService.getUserTrips(),
        subscriptionsService.getSubscriptionStatus()
      ])
      setTrips(tripsData)
      setSubscription(subData)
    } catch (error) {
      console.error('[DASHBOARD] [ERROR] Load failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTripCreated = () => {
    setShowCreateModal(false)
    loadData()
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    })
  }

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500' 
    return 'bg-red-500'
  }

  const getTripStatus = (trip) => {
    const now = new Date()
    const startDate = new Date(trip.start_date)
    const endDate = new Date(trip.end_date)
    
    if (now < startDate) return { text: 'Próximo', color: 'bg-blue-100 text-blue-800' }
    if (now >= startDate && now <= endDate) return { text: 'En curso', color: 'bg-green-100 text-green-800' }
    return { text: 'Completado', color: 'bg-gray-100 text-gray-800' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🧳</div>
          <div className="text-lg text-gray-600">Cargando tu dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar 
        user={user}
        subscription={subscription}
        onNavigate={onNavigate}
        onLogout={onLogout}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      {/* Sidebar */}
      <Sidebar
        currentRoute="dashboard"
        onNavigate={onNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:ml-0 min-h-[calc(100vh-81px)]">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                ¡Bienvenido de vuelta! 👋
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Explora tus rutas de viaje favoritas
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 font-medium">Total Viajes</span>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-800">{trips.length}</p>
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-green-600 font-medium">Este mes</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 font-medium">Presupuesto Total</span>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-800">
                  ${trips.reduce((sum, trip) => sum + (trip.estimated_total_budget || 0), 0).toLocaleString()}
                </p>
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-green-600 font-medium">Planificado</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 font-medium">Miembros</span>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-800">
                  {trips.reduce((sum, trip) => sum + (trip.members?.length || 0), 0)}
                </p>
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-blue-600 font-medium">Total</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 font-medium">Países</span>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-800">
                  {new Set(trips.map(trip => trip.destination?.split(',').pop()?.trim())).size || 0}
                </p>
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-orange-600 font-medium">Visitados</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trips Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Mis Viajes ({trips.length})
                    </h2>
                    <p className="text-gray-600">Gestiona y explora tus aventuras</p>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate('my-trips')}
                  className="text-primary hover:text-primary-hover font-medium transition-colors duration-200"
                >
                  Ver todos →
                </button>
              </div>
            </div>

            <div className="p-6">
              {trips.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="text-6xl">🌍</div>
                  <h3 className="text-xl font-semibold text-gray-800">¡Tu primera aventura te espera!</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    No tienes viajes aún. Crea tu primer viaje y comienza a planificar experiencias increíbles.
                  </p>
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-hover transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg"
                  >
                    ✈️ Crear mi primer viaje
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.slice(0, 6).map(trip => {
                    const status = getTripStatus(trip)
                    const budgetUsed = trip.estimated_total_budget > 0 ? 
                      ((trip.estimated_total_budget - (trip.estimated_total_budget * 0.7)) / trip.estimated_total_budget * 100) : 0
                    
                    return (
                      <div 
                        key={trip.id} 
                        className="bg-gray-50 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-gray-100"
                        onClick={() => onNavigate('trip-details', { tripId: trip.id })}
                      >
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-1">
                                {trip.title}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                📍 {trip.destination}
                              </p>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              {status.text}
                            </span>
                          </div>

                          {/* Dates */}
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <span>📅</span>
                              <span>{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
                            </div>
                          </div>

                          {/* Members */}
                          {trip.members && trip.members.length > 0 && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">👥</span>
                              <span className="text-sm text-gray-600">{trip.members.length} miembros</span>
                            </div>
                          )}

                          {/* Budget */}
                          {trip.estimated_total_budget && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Presupuesto</span>
                                <span className="font-medium text-gray-800">
                                  {trip.base_currency} {trip.estimated_total_budget.toLocaleString()}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${getProgressColor(budgetUsed)}`}
                                  style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {/* Action Button */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              onNavigate('trip-details', { tripId: trip.id })
                            }}
                            className="w-full bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors duration-200"
                          >
                            Ver Detalles
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Crear Viaje - Botón abajo */}
          {trips.length > 0 && (
            <div className="text-center">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-primary text-white font-semibold px-8 py-4 rounded-full hover:bg-primary-hover transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Crear Nuevo Viaje</span>
              </button>
            </div>
          )}

          {/* Quick Actions - Solo si tiene viajes */}
          {trips.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "Ver Fotos", icon: "📸", action: "photos", color: "bg-blue-500" },
                  { title: "Estadísticas", icon: "📊", action: "stats", color: "bg-green-500" },
                  { title: "Amigos", icon: "👥", action: "friends", color: "bg-purple-500" },
                  { title: "Configuración", icon: "⚙️", action: "settings", color: "bg-gray-500" }
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={() => onNavigate(action.action)}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-center space-y-2"
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto text-white text-xl`}>
                      {action.icon}
                    </div>
                    <p className="font-medium text-gray-800 text-sm">{action.title}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showCreateModal && (
        <CreateTripModal 
          onClose={() => setShowCreateModal(false)}
          onTripCreated={handleTripCreated}
        />
      )}
    </div>
  )
}

export default Dashboard