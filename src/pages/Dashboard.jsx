import { useState, useEffect } from 'react'
import { tripsService } from '../services/api/tripsService.js'
import { subscriptionsService } from '../services/api/subscriptionsService.js'
import CreateTripModal from '../components/CreateTripModal.jsx'

function Dashboard({ onNavigate }) {
  const [trips, setTrips] = useState([])
  const [subscription, setSubscription] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Debug: verificar token antes de hacer requests
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

  if (loading) return <div>Cargando...</div>

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>

      {/* Subscription Status */}
      {subscription && (
        <div style={{ padding: '15px', border: '1px solid #ccc', marginBottom: '20px' }}>
          <h3>Suscripción: {subscription.plan.toUpperCase()}</h3>
          {subscription.is_pro ? (
            <p>Plan PRO activo {subscription.expires_at && `- Expira: ${new Date(subscription.expires_at).toLocaleDateString()}`}</p>
          ) : (
            <div>
              <p>Plan FREE - Máximo 1 viaje</p>
              <button onClick={() => onNavigate('subscription')}>Actualizar a PRO</button>
            </div>
          )}
        </div>
      )}

      {/* Create Trip Button */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setShowCreateModal(true)}
          style={{ padding: '10px 20px', fontSize: '16px' }}
        >
          Crear Nuevo Viaje
        </button>
      </div>

      {/* Trips List */}
      <div>
        <h2>Mis Viajes ({trips.length})</h2>
        {trips.length === 0 ? (
          <p>No tienes viajes. ¡Crea tu primer viaje!</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {trips.map(trip => (
              <div key={trip.id} style={{ border: '1px solid #ccc', padding: '15px' }}>
                <h3>{trip.title}</h3>
                <p>Fechas: {trip.start_date} a {trip.end_date}</p>
                <p>Miembros: {trip.members.length}</p>
                {trip.estimated_total_budget && <p>Presupuesto: {trip.base_currency} {trip.estimated_total_budget}</p>}
                <button onClick={() => onNavigate('trip-details', { tripId: trip.id })}>
                  Ver Detalles
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

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