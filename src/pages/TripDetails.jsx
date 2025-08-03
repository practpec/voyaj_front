import { useState, useEffect } from 'react'
import { tripsService } from '../services/api/tripsService.js'
import { expensesService } from '../services/api/expensesService.js'
import { photosService } from '../services/api/photosService.js'
import { journalService } from '../services/api/journalService.js'

function TripDetails({ tripId, onNavigate }) {
  const [trip, setTrip] = useState(null)
  const [activeTab, setActiveTab] = useState('schedule')
  const [expenses, setExpenses] = useState([])
  const [photos, setPhotos] = useState([])
  const [journalEntries, setJournalEntries] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  // Forms
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showJournalForm, setShowJournalForm] = useState(false)
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    currency: 'MXN',
    category: 'otros'
  })
  const [journalForm, setJournalForm] = useState({
    day_id: '',
    content: '',
    emotions: {},
    recommendations: []
  })

  useEffect(() => {
    loadTripData()
  }, [tripId])

  useEffect(() => {
    if (activeTab === 'expenses') loadExpenses()
    if (activeTab === 'photos') loadPhotos()
    if (activeTab === 'journal') loadJournalEntries()
    if (activeTab === 'analytics') loadAnalytics()
  }, [activeTab])

  const loadTripData = async () => {
    try {
      const tripData = await tripsService.getTripDetails(tripId)
      setTrip(tripData)
      if (tripData.days.length > 0) {
        setJournalForm(prev => ({ ...prev, day_id: tripData.days[0].id }))
      }
    } catch (error) {
      setMessage(error.toString())
    } finally {
      setLoading(false)
    }
  }

  const loadExpenses = async () => {
    try {
      const data = await expensesService.getTripExpenses(tripId)
      setExpenses(data)
    } catch (error) {
      setMessage(error.toString())
    }
  }

  const loadPhotos = async () => {
    try {
      const data = await photosService.getTripPhotos(tripId)
      setPhotos(data)
    } catch (error) {
      setMessage(error.toString())
    }
  }

  const loadJournalEntries = async () => {
    try {
      const data = await journalService.getTripEntries(tripId)
      setJournalEntries(data)
    } catch (error) {
      setMessage(error.toString())
    }
  }

  const loadAnalytics = async () => {
    try {
      const data = await tripsService.getTripAnalytics(tripId)
      setAnalytics(data)
    } catch (error) {
      setMessage(error.toString())
    }
  }

  const createExpense = async (e) => {
    e.preventDefault()
    try {
      await expensesService.createExpense(tripId, expenseForm)
      setShowExpenseForm(false)
      setExpenseForm({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        currency: 'MXN',
        category: 'otros'
      })
      loadExpenses()
      setMessage('Gasto creado')
    } catch (error) {
      setMessage(error.toString())
    }
  }

  const createJournalEntry = async (e) => {
    e.preventDefault()
    try {
      await journalService.createEntry(tripId, journalForm)
      setShowJournalForm(false)
      setJournalForm({
        day_id: trip.days[0]?.id || '',
        content: '',
        emotions: {},
        recommendations: []
      })
      loadJournalEntries()
      setMessage('Entrada creada')
    } catch (error) {
      setMessage(error.toString())
    }
  }

  const uploadPhoto = async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      await photosService.uploadPhoto(tripId, formData)
      loadPhotos()
      setMessage('Foto subida')
    } catch (error) {
      setMessage(error.toString())
    }
  }

  const deleteExpense = async (expenseId) => {
    if (!confirm('¿Eliminar gasto?')) return
    try {
      await expensesService.deleteExpense(tripId, expenseId)
      loadExpenses()
      setMessage('Gasto eliminado')
    } catch (error) {
      setMessage(error.toString())
    }
  }

  if (loading) return <div>Cargando...</div>
  if (!trip) return <div>Viaje no encontrado</div>

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => onNavigate('dashboard')}>← Volver</button>
        <h1>{trip.title}</h1>
        <p>{trip.start_date} a {trip.end_date}</p>
        <p>Miembros: {trip.members.length}</p>
      </div>

      {message && <div style={{ color: 'green', marginBottom: '15px' }}>{message}</div>}

      {/* Tabs */}
      <div style={{ marginBottom: '20px' }}>
        {['schedule', 'expenses', 'photos', 'journal', 'analytics'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 15px',
              marginRight: '10px',
              backgroundColor: activeTab === tab ? '#ddd' : ''
            }}
          >
            {tab === 'schedule' && 'Cronograma'}
            {tab === 'expenses' && 'Gastos'}
            {tab === 'photos' && 'Fotos'}
            {tab === 'journal' && 'Diario'}
            {tab === 'analytics' && 'Analytics'}
          </button>
        ))}
      </div>

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div>
          <h2>Cronograma</h2>
          {trip.days.map(day => (
            <div key={day.id} style={{ border: '1px solid #ccc', padding: '15px', margin: '10px 0' }}>
              <h3>{new Date(day.date).toLocaleDateString()}</h3>
              {day.notes && <p>{day.notes}</p>}
              <div>
                <h4>Actividades ({day.activities.length})</h4>
                {day.activities.map(activity => (
                  <div key={activity.id} style={{ marginLeft: '20px', padding: '10px', border: '1px solid #eee' }}>
                    <h5>{activity.title}</h5>
                    {activity.description && <p>{activity.description}</p>}
                    {activity.location && <p>📍 {activity.location}</p>}
                    {activity.start_time && <p>🕐 {activity.start_time}</p>}
                    {activity.estimated_cost && <p>💰 {activity.estimated_cost}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Gastos ({expenses.length})</h2>
            <button onClick={() => setShowExpenseForm(true)}>Agregar Gasto</button>
          </div>

          {showExpenseForm && (
            <form onSubmit={createExpense} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
              <h3>Nuevo Gasto</h3>
              <input
                type="number"
                step="0.01"
                placeholder="Monto"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <input
                type="text"
                placeholder="Descripción"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <input
                type="date"
                value={expenseForm.date}
                onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <select
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              >
                <option value="transporte">Transporte</option>
                <option value="alojamiento">Alojamiento</option>
                <option value="comida">Comida</option>
                <option value="actividades">Actividades</option>
                <option value="compras">Compras</option>
                <option value="otros">Otros</option>
              </select>
              <div>
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setShowExpenseForm(false)} style={{ marginLeft: '10px' }}>
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div>
            {expenses.map(expense => (
              <div key={expense.id} style={{ border: '1px solid #ccc', padding: '15px', margin: '10px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h4>{expense.description}</h4>
                    <p>{expense.currency} {expense.amount} - {expense.category}</p>
                    <p>{expense.date}</p>
                  </div>
                  <button 
                    onClick={() => deleteExpense(expense.id)}
                    style={{ backgroundColor: 'red', color: 'white', padding: '5px' }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photos Tab */}
      {activeTab === 'photos' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Fotos ({photos.length})</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files[0] && uploadPhoto(e.target.files[0])}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {photos.map(photo => (
              <div key={photo.id} style={{ border: '1px solid #ccc' }}>
                <img 
                  src={photo.file_url} 
                  alt="Foto del viaje"
                  style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                />
                <div style={{ padding: '10px' }}>
                  {photo.location && <p>📍 {photo.location}</p>}
                  {photo.taken_at && <p>{new Date(photo.taken_at).toLocaleDateString()}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Journal Tab */}
      {activeTab === 'journal' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Diario ({journalEntries.length})</h2>
            <button onClick={() => setShowJournalForm(true)}>Nueva Entrada</button>
          </div>

          {showJournalForm && (
            <form onSubmit={createJournalEntry} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
              <h3>Nueva Entrada</h3>
              <select
                value={journalForm.day_id}
                onChange={(e) => setJournalForm({ ...journalForm, day_id: e.target.value })}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              >
                {trip.days.map(day => (
                  <option key={day.id} value={day.id}>
                    {new Date(day.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Contenido de la entrada..."
                value={journalForm.content}
                onChange={(e) => setJournalForm({ ...journalForm, content: e.target.value })}
                required
                rows={6}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <div>
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setShowJournalForm(false)} style={{ marginLeft: '10px' }}>
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div>
            {journalEntries.map(entry => (
              <div key={entry.id} style={{ border: '1px solid #ccc', padding: '15px', margin: '10px 0' }}>
                <h4>{new Date(entry.created_at).toLocaleDateString()}</h4>
                <p>{entry.content}</p>
                {entry.recommendations.length > 0 && (
                  <div>
                    <h5>Recomendaciones:</h5>
                    {entry.recommendations.map((rec, index) => (
                      <p key={index}>{rec.type}: {rec.note}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <div>
          <h2>Analytics del Viaje</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ border: '1px solid #ccc', padding: '15px' }}>
              <h3>Resumen del Viaje</h3>
              <p>Total días: {analytics.trip_summary.total_days}</p>
              <p>Días con actividades: {analytics.trip_summary.days_with_activities}</p>
              <p>Total actividades: {analytics.trip_summary.total_activities}</p>
              <p>Total miembros: {analytics.trip_summary.total_members}</p>
            </div>

            <div style={{ border: '1px solid #ccc', padding: '15px' }}>
              <h3>Resumen de Gastos</h3>
              <p>Total gastado: {trip.base_currency} {analytics.expense_summary.total_expenses}</p>
              <p>Número de gastos: {analytics.expense_summary.total_expense_records}</p>
              <p>Presupuesto estimado: {trip.base_currency} {analytics.expense_summary.budget_vs_actual.estimated_budget}</p>
              <p>Varianza: {trip.base_currency} {analytics.expense_summary.budget_vs_actual.variance}</p>
            </div>

            <div style={{ border: '1px solid #ccc', padding: '15px' }}>
              <h3>Contenido</h3>
              <p>Total fotos: {analytics.content_summary.total_photos}</p>
              <p>Entradas de diario: {analytics.content_summary.total_journal_entries}</p>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>Gastos por Categoría</h3>
            {Object.entries(analytics.expense_summary.expenses_by_category).map(([category, amount]) => (
              <p key={category}>{category}: {trip.base_currency} {amount}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TripDetails