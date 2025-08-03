import { useState, useEffect } from 'react'
import { tripsService } from '../services/api/tripsService.js'
import { subscriptionsService } from '../services/api/subscriptionsService.js'
import CreateTripModal from '../components/createTripModal.jsx'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'

function Trips({ user, onNavigate, onLogout }) {
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
      const [tripsData, subData] = await Promise.all([
        tripsService.getUserTrips(),
        subscriptionsService.getSubscriptionStatus()
      ])
      setTrips(tripsData)
      setSubscription(subData)
    } catch (error) {
      console.error('[TRIPS] [ERROR] Load failed:', error)
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
          <div className="text-lg text-gray-600">Cargando tus viajes...</div>
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
        currentRoute="trips"
        onNavigate={onNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:ml-0 min-h-[calc(100vh-81px)]">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
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

export default Trips