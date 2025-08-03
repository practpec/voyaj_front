import { useState, useEffect } from 'react'
import { tripsService } from '../services/api/tripsService.js'
import { expensesService } from '../services/api/expensesService.js'
import { photosService } from '../services/api/photosService.js'
import { journalService } from '../services/api/journalService.js'
import { subscriptionsService } from '../services/api/subscriptionsService.js'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import TripHeader from '../components/TripHeader'
import AnalyticsCards from '../components/AnalyticsCards'
import DayCard from '../components/DayCard'
import PhotosGrid from '../components/PhotosGrid'
import DayDetailModal from '../components/DayDetailModal'

function TripDetails({ tripId, user, onNavigate, onLogout }) {
  const [trip, setTrip] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [photos, setPhotos] = useState([])
  const [journalEntries, setJournalEntries] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [uploadLoading, setUploadLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
    title: ''
  })

  useEffect(() => {
    if (tripId) {
      loadTripData()
    }
  }, [tripId])

  const loadTripData = async () => {
    try {
      setLoading(true)
      
      const tripData = await tripsService.getTripDetails(tripId)
      const subscriptionData = await subscriptionsService.getSubscriptionStatus()
      const expensesData = await expensesService.getTripExpenses(tripId)
      const photosData = await photosService.getTripPhotos(tripId)
      
      setTrip(tripData)
      setSubscription(subscriptionData)
      setExpenses(expensesData)
      setPhotos(photosData)
      
      try {
        const journalData = await journalService.getTripEntries(tripId)
        setJournalEntries(journalData)
      } catch (error) {
        setJournalEntries([])
      }
      
      try {
        const analyticsData = await tripsService.getTripAnalytics(tripId)
        setAnalytics(analyticsData)
      } catch (error) {
        setAnalytics(null)
      }
      
    } catch (error) {
      console.error('[TRIPDETAILS] Error loading trip data:', error)
      setMessage('Error al cargar los datos del viaje')
    } finally {
      setLoading(false)
    }
  }

  const uploadPhoto = async (file, location = '') => {
    if (!trip || !trip.days || trip.days.length === 0) {
      setMessage('Error: No hay días disponibles para asociar la foto')
      return
    }

    try {
      setUploadLoading(true)
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('location', location)
      formData.append('associated_day_id', trip.days[0].id)
      
      await photosService.uploadPhoto(tripId, formData)
      await loadTripData()
      setMessage('Foto subida exitosamente')
      
    } catch (error) {
      console.error('[TRIPDETAILS] Error uploading photo:', error)
      setMessage('Error al subir la foto')
    } finally {
      setUploadLoading(false)
    }
  }

  const deletePhoto = async (photoId) => {
    try {
      await photosService.deletePhoto(tripId, photoId)
      await loadTripData()
      setMessage('Foto eliminada')
    } catch (error) {
      console.error('[TRIPDETAILS] Error deleting photo:', error)
      setMessage('Error al eliminar la foto')
    }
  }

  const handleDayClick = (day) => {
    setSelectedDay(day)
    setExpenseForm(prev => ({ ...prev, date: day.date }))
    setJournalForm(prev => ({ ...prev, day_id: day.id }))
    setShowDayModal(true)
  }

  const createExpense = async () => {
    if (!selectedDay) return

    try {
      const expenseData = {
        ...expenseForm,
        day_id: selectedDay.id,
        amount: parseFloat(expenseForm.amount)
      }
      
      await expensesService.createExpense(tripId, expenseData)
      await loadTripData()
      setMessage('Gasto agregado exitosamente')
      setExpenseForm({
        amount: '',
        description: '',
        date: selectedDay.date,
        currency: 'MXN',
        category: 'otros'
      })
      
    } catch (error) {
      console.error('[TRIPDETAILS] Error creating expense:', error)
      setMessage('Error al crear el gasto')
    }
  }

  const deleteExpense = async (expenseId) => {
    try {
      await expensesService.deleteExpense(tripId, expenseId)
      await loadTripData()
      setMessage('Gasto eliminado')
    } catch (error) {
      console.error('[TRIPDETAILS] Error deleting expense:', error)
      setMessage('Error al eliminar el gasto')
    }
  }

  const createJournalEntry = async () => {
    if (!selectedDay) return

    try {
      await journalService.createEntry(tripId, journalForm)
      await loadTripData()
      setMessage('Entrada de diario creada exitosamente')
      setJournalForm({
        day_id: selectedDay.id,
        content: '',
        title: ''
      })
      
    } catch (error) {
      console.error('[TRIPDETAILS] Error creating journal entry:', error)
      setMessage('Error al crear la entrada de diario')
    }
  }

  const getDayExpenses = (dayId) => {
    return expenses.filter(expense => expense.day_id === dayId)
  }

  const getDayJournalEntries = (dayId) => {
    return journalEntries.filter(entry => entry.day_id === dayId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-alt font-sans">
        <Navbar 
          user={user} 
          subscription={subscription} 
          onNavigate={onNavigate} 
          onLogout={onLogout} 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="flex">
          <Sidebar 
            isOpen={isSidebarOpen} 
            onNavigate={onNavigate} 
            activeSection="trips"
          />
          <div className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🧳</div>
              <p className="text-text-muted">Cargando detalles del viaje...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-background-alt font-sans">
        <Navbar 
          user={user} 
          subscription={subscription} 
          onNavigate={onNavigate} 
          onLogout={onLogout} 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="flex">
          <Sidebar 
            isOpen={isSidebarOpen} 
            onNavigate={onNavigate} 
            activeSection="trips"
          />
          <div className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">❌</div>
              <p className="text-text-default text-lg font-medium">Viaje no encontrado</p>
              <p className="text-text-muted">El viaje que buscas no existe o no tienes acceso a él.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-alt font-sans">
      <Navbar 
        user={user} 
        subscription={subscription} 
        onNavigate={onNavigate} 
        onLogout={onLogout} 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onNavigate={onNavigate} 
          activeSection="trips"
        />
        
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
          <div className="max-w-7xl mx-auto p-6">
            {message && (
              <div className="mb-6 p-4 bg-accent border border-border-default rounded-xl text-text-default">
                {message}
              </div>
            )}

            <TripHeader trip={trip} onNavigate={onNavigate} />

            {analytics && (
              <div className="mb-8">
                <AnalyticsCards analytics={analytics} trip={trip} />
              </div>
            )}

            <div className="bg-background rounded-xl shadow-xl border border-border-default p-6 mb-8">
              <h3 className="text-lg font-semibold text-text-default mb-4">Acciones Rápidas</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => trip.days.length > 0 && handleDayClick(trip.days[0])}
                  className="bg-primary hover:bg-primary-hover text-background px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 shadow-lg font-semibold"
                >
                  💰 Agregar Gasto
                </button>
                <button
                  onClick={() => trip.days.length > 0 && handleDayClick(trip.days[0])}
                  className="bg-accent hover:bg-accent text-text-default px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 shadow-lg font-semibold border border-border-default"
                >
                  📝 Escribir Diario
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-default mb-6">Días del Viaje</h2>
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

            <PhotosGrid 
              photos={photos}
              onUpload={uploadPhoto}
              onDelete={deletePhoto}
              uploadLoading={uploadLoading}
            />
          </div>

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
      </div>
    </div>
  )
}

export default TripDetails