import { useState, useEffect } from 'react'
import { tripsService } from '../services/api/tripsService.js'
import { expensesService } from '../services/api/expensesService.js'
import { photosService } from '../services/api/photosService.js'
import { journalService } from '../services/api/journalService.js'
import TripHeader from '../components/TripHeader'
import AnalyticsCards from '../components/AnalyticsCards'
import DayCard from '../components/DayCard'
import PhotosGrid from '../components/PhotosGrid'
import DayDetailModal from '../components/DayDetailModal'

function TripDetails({ tripId, onNavigate }) {
  const [trip, setTrip] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [photos, setPhotos] = useState([])
  const [journalEntries, setJournalEntries] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [uploadLoading, setUploadLoading] = useState(false)

  // Modal state
  const [selectedDay, setSelectedDay] = useState(null)
  const [showDayModal, setShowDayModal] = useState(false)

  // Forms
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
    loadAnalytics()
    loadExpenses()
    loadPhotos()
    loadJournalEntries()
  }, [tripId])

  const loadTripData = async () => {
    try {
      const tripData = await tripsService.getTripDetails(tripId)
      setTrip(tripData)
      if (tripData.days.length > 0) {
        setJournalForm(prev => ({ ...prev, day_id: tripData.days[0].id }))
      }
    } catch (error) {
      setMessage(`Error: ${error.toString()}`)
    } finally {
      setLoading(false)
    }
  }

  const loadExpenses = async () => {
    try {
      const data = await expensesService.getTripExpenses(tripId)
      setExpenses(data)
    } catch (error) {
      setMessage(`Error: ${error.toString()}`)
    }
  }

  const loadPhotos = async () => {
    try {
      const data = await photosService.getTripPhotos(tripId)
      setPhotos(data)
    } catch (error) {
      setMessage(`Error: ${error.toString()}`)
    }
  }

  const loadJournalEntries = async () => {
    try {
      const data = await journalService.getTripEntries(tripId)
      setJournalEntries(data)
    } catch (error) {
      setMessage(`Error: ${error.toString()}`)
    }
  }

  const loadAnalytics = async () => {
    try {
      const data = await tripsService.getTripAnalytics(tripId)
      setAnalytics(data)
    } catch (error) {
      setMessage(`Error: ${error.toString()}`)
    }
  }

  const handleDayClick = (day) => {
    setSelectedDay(day)
    setJournalForm(prev => ({ ...prev, day_id: day.id }))
    setExpenseForm(prev => ({ ...prev, date: day.date }))
    setShowDayModal(true)
  }

  const createExpense = async (e) => {
    e.preventDefault()
    try {
      await expensesService.createExpense(tripId, expenseForm)
      setExpenseForm({
        amount: '',
        description: '',
        date: selectedDay?.date || new Date().toISOString().split('T')[0],
        currency: 'MXN',
        category: 'otros'
      })
      loadExpenses()
      setMessage('Gasto creado')
    } catch (error) {
      setMessage(`Error: ${error.toString()}`)
    }
  }

  const createJournalEntry = async (e) => {
    e.preventDefault()
    try {
      await journalService.createEntry(tripId, journalForm)
      setJournalForm({
        day_id: selectedDay?.id || trip.days[0]?.id || '',
        content: '',
        emotions: {},
        recommendations: []
      })
      loadJournalEntries()
      setMessage('Entrada creada')
    } catch (error) {
      setMessage(`Error: ${error.toString()}`)
    }
  }

  const uploadPhoto = async (file) => {
    if (!file) return
    
    setUploadLoading(true)
    setMessage('')
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      await photosService.uploadPhoto(tripId, formData)
      loadPhotos()
      setMessage('Foto subida correctamente')
      
    } catch (error) {
      setMessage(`Error al subir foto: ${error.toString()}`)
    } finally {
      setUploadLoading(false)
    }
  }

  const deleteExpense = async (expenseId) => {
    if (!confirm('¿Eliminar gasto?')) return
    try {
      await expensesService.deleteExpense(tripId, expenseId)
      loadExpenses()
      setMessage('Gasto eliminado')
    } catch (error) {
      setMessage(`Error: ${error.toString()}`)
    }
  }

  const deletePhoto = async (photoId) => {
    if (!confirm('¿Eliminar foto?')) return
    try {
      await photosService.deletePhoto(tripId, photoId)
      loadPhotos()
      setMessage('Foto eliminada')
    } catch (error) {
      setMessage(`Error: ${error.toString()}`)
    }
  }

  // Filter data for selected day
  const getDayExpenses = (dayId) => {
    const day = trip?.days.find(d => d.id === dayId)
    if (!day) return []
    return expenses.filter(expense => expense.date === day.date)
  }

  const getDayJournalEntries = (dayId) => {
    return journalEntries.filter(entry => entry.day_id === dayId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Viaje no encontrado</p>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TripHeader trip={trip} onNavigate={onNavigate} message={message} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Analytics Section */}
        <AnalyticsCards analytics={analytics} trip={trip} />

        {/* Days Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Días del Viaje</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trip.days.map(day => (
              <DayCard 
                key={day.id} 
                day={day} 
                onDayClick={handleDayClick}
              />
            ))}
          </div>
        </div>

        {/* Photos Section */}
        <PhotosGrid 
          photos={photos}
          onUpload={uploadPhoto}
          onDelete={deletePhoto}
          uploadLoading={uploadLoading}
        />
      </div>

      {/* Day Detail Modal */}
      <DayDetailModal
        day={selectedDay}
        isOpen={showDayModal}
        onClose={() => setShowDayModal(false)}
        onCreateExpense={createExpense}
        onCreateJournal={createJournalEntry}
        expenseForm={expenseForm}
        setExpenseForm={setExpenseForm}
        journalForm={journalForm}
        setJournalForm={setJournalForm}
        dayExpenses={selectedDay ? getDayExpenses(selectedDay.id) : []}
        dayJournalEntries={selectedDay ? getDayJournalEntries(selectedDay.id) : []}
        onDeleteExpense={deleteExpense}
      />
    </div>
  )
}

export default TripDetails