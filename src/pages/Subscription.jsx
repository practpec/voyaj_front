import { useState, useEffect } from 'react'
import { subscriptionsService } from '../services/api/subscriptionsService.js'

function Subscription() {
  const [subscription, setSubscription] = useState(null)
  const [paymentHistory, setPaymentHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadSubscriptionData()
  }, [])

  const loadSubscriptionData = async () => {
    try {
      console.log('[SUBSCRIPTION] Loading data...')
      
      const subData = await subscriptionsService.getSubscriptionStatus()
      console.log('[SUBSCRIPTION] Status loaded:', subData)
      setSubscription(subData)
      
      try {
        const historyData = await subscriptionsService.getPaymentHistory()
        console.log('[SUBSCRIPTION] History loaded:', historyData)
        setPaymentHistory(historyData)
      } catch (historyError) {
        console.log('[SUBSCRIPTION] History failed (non-critical):', historyError)
        setPaymentHistory([])
      }
      
    } catch (error) {
      console.error('[SUBSCRIPTION] [ERROR] Load failed:', error)
      setMessage(error.toString())
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    try {
      setLoading(true)
      const response = await subscriptionsService.createPayment()
      window.open(response.init_point, '_blank')
      setMessage('Redirigiendo a MercadoPago...')
    } catch (error) {
      setMessage(error.toString())
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('¿Estás seguro de cancelar tu suscripción?')) return

    try {
      setLoading(true)
      await subscriptionsService.cancelSubscription()
      setMessage('Suscripción cancelada')
      loadSubscriptionData()
    } catch (error) {
      setMessage(error.toString())
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Cargando suscripción...</div>

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestión de Suscripción</h1>

      {message && <div style={{ color: message.includes('Error') ? 'red' : 'green', marginBottom: '15px' }}>
        {message}
      </div>}

      {/* Debug Info */}
      <div style={{ backgroundColor: '#f5f5f5', padding: '10px', marginBottom: '20px' }}>
        <h3>Debug Info:</h3>
        <p>Subscription loaded: {subscription ? 'Yes' : 'No'}</p>
        <p>Payment history count: {paymentHistory.length}</p>
        {subscription && <p>Plan: {subscription.plan}, PRO: {subscription.is_pro ? 'Yes' : 'No'}</p>}
      </div>

      {/* Current Plan */}
      {subscription ? (
        <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
          <h2>Plan Actual: {subscription.plan.toUpperCase()}</h2>
          <p>Estado: {subscription.status}</p>
          
          {subscription.is_pro ? (
            <div>
              <p>✅ Acceso PRO activo</p>
              {subscription.expires_at && (
                <p>Expira: {new Date(subscription.expires_at).toLocaleDateString()}</p>
              )}
              {subscription.days_remaining !== undefined && (
                <p>Días restantes: {subscription.days_remaining}</p>
              )}
              <button 
                onClick={handleCancel}
                disabled={loading}
                style={{ padding: '10px', backgroundColor: 'red', color: 'white' }}
              >
                Cancelar Suscripción
              </button>
            </div>
          ) : (
            <div>
              <p>📱 Plan FREE - Límites:</p>
              <ul>
                <li>Máximo 1 viaje activo</li>
                <li>Funciones básicas</li>
              </ul>
              
              <h3>🚀 Actualizar a PRO - $24.99 MXN/mes</h3>
              <p>Beneficios PRO:</p>
              <ul>
                <li>✈️ Viajes ilimitados</li>
                <li>📸 Fotos ilimitadas</li>
                <li>📊 Análisis avanzados</li>
                <li>📄 Export PDF</li>
              </ul>
              
              <button 
                onClick={handleUpgrade}
                disabled={loading}
                style={{ 
                  padding: '15px 30px', 
                  backgroundColor: 'green', 
                  color: 'white', 
                  fontSize: '16px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {loading ? 'Procesando...' : 'Actualizar a PRO'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ border: '1px solid red', padding: '20px', marginBottom: '20px' }}>
          <h2>❌ Error cargando suscripción</h2>
          <p>No se pudo cargar la información de tu suscripción</p>
          <button onClick={loadSubscriptionData}>Reintentar</button>
        </div>
      )}

      {/* Payment History */}
      <div>
        <h2>Historial de Pagos</h2>
        {paymentHistory.length === 0 ? (
          <p>No hay pagos registrados</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Fecha</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Monto</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Estado</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Método</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map(payment => (
                <tr key={payment.payment_id}>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    {new Date(payment.date_created).toLocaleDateString()}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    {payment.currency} {payment.amount}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    {payment.status}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    {payment.payment_method}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Subscription