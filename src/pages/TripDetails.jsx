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

  // Photo upload form
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [photoForm, setPhotoForm] = useState({
    file: null,
    location: '',
    associated_day_id: ''
  })

  useEffect(() => {
    if (tripId) {
      loadTripData()
    }
  }, [tripId])

  const loadTripData = async () => {
    try {
      setLoading(true)
      
      // Primero cargar los datos principales
      const tripData = await tripsService.getTripDetails(tripId)
      const subscriptionData = await subscriptionsService.getSubscriptionStatus()
      const expensesData = await expensesService.getTripExpenses(tripId)
      const photosData = await photosService.getTripPhotos(tripId)
      
      setTrip(tripData)
      setSubscription(subscriptionData)
      setExpenses(expensesData)
      setPhotos(photosData)
      
      // Cargar datos opcionales sin bloquear
      try {
        const journalData = await journalService.getTripJournalEntries(tripId)
        setJournalEntries(journalData)
      } catch (error) {
        console.log('Journal entries not available:', error)
        setJournalEntries([])
      }
      
      try {
        const analyticsData = await tripsService.getTripAnalytics(tripId)
        setAnalytics(analyticsData)
      } catch (error) {
        console.log('Analytics not available:', error)
        setAnalytics(null)
      }
      
      // Set default day for photo upload
      if (tripData && tripData.days && tripData.days.length > 0) {
        setPhotoForm(prev => ({ ...prev, associated_day_id: tripData.days[0].id }))
      }
      
    } catch (error) {
      console.error('Error loading trip data:', error)
      setMessage('Error al cargar los datos del viaje')
    } finally {
      setLoading(false)
    }
  }

  const uploadPhoto = async (file, location = '') => {
    if (!photoForm.associated_day_id) {
      setMessage('Error: Selecciona un día para asociar la foto')
      return
    }

    try {
      setUploadLoading(true)
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('location', location)
      formData.append('associated_day_id', photoForm.associated_day_id)
      
      await photosService.uploadPhoto(tripId, formData)
      await loadTripData()
      setMessage('Foto subida exitosamente')
      setShowPhotoModal(false)
      setPhotoForm({ file: null, location: '', associated_day_id: photoForm.associated_day_id })
      
    } catch (error) {
      console.error('Error uploading photo:', error)
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
      console.error('Error deleting photo:', error)
      setMessage('Error al eliminar la foto')
    }
  }

  const createExpense = async () => {
    try {
      if (!selectedDay) return
      
      const expenseData = {
        ...expenseForm,
        day_id: selectedDay.id
      }
      
      await expensesService.createExpense(tripId, expenseData)
      await loadTripData()
      setMessage('Gasto creado exitosamente')
      setExpenseForm({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        currency: 'MXN',
        category: 'otros'
      })
    } catch (error) {
      console.error('Error creating expense:', error)
      setMessage('Error al crear el gasto')
    }
  }

  const deleteExpense = async (expenseId) => {
    try {
      await expensesService.deleteExpense(tripId, expenseId)
      await loadTripData()
      setMessage('Gasto eliminado')
    } catch (error) {
      console.error('Error deleting expense:', error)
      setMessage('Error al eliminar el gasto')
    }
  }

  const createJournalEntry = async () => {
    try {
      if (!selectedDay) return
      
      const journalData = {
        ...journalForm,
        day_id: selectedDay.id
      }
      
      await journalService.createJournalEntry(tripId, journalData)
      await loadTripData()
      setMessage('Entrada del diario creada exitosamente')
      setJournalForm({
        day_id: '',
        content: '',
        title: ''
      })
    } catch (error) {
      console.error('Error creating journal entry:', error)
      setMessage('Error al crear la entrada del diario')
    }
  }

  const handleDayClick = (day) => {
    setSelectedDay(day)
    setShowDayModal(true)
    setJournalForm(prev => ({ ...prev, day_id: day.id }))
  }

  const getDayExpenses = (dayId) => {
    return expenses.filter(expense => expense.day_id === dayId)
  }

  const getDayJournalEntries = (dayId) => {
    return journalEntries.filter(entry => entry.day_id === dayId)
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      uploadPhoto(file, photoForm.location)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Cargando detalles del viaje...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} subscription={subscription} onNavigate={onNavigate} onLogout={onLogout} />
        <Sidebar currentRoute="trips" onNavigate={onNavigate} />
        
        <div className="lg:ml-20 pt-20">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center space-y-6">
              <div className="text-8xl">🗺️</div>
              <h1 className="text-3xl font-bold text-gray-800">Viaje no encontrado</h1>
              <p className="text-gray-600">El viaje que buscas no existe o no tienes acceso a él.</p>
              <button 
                onClick={() => onNavigate('trips')}
                className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 transform transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Volver a Mis Viajes
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={user} 
        subscription={subscription} 
        onNavigate={onNavigate} 
        onLogout={onLogout}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      
      <Sidebar
        currentRoute="trips"
        onNavigate={onNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="lg:ml-20 pt-20">
        <TripHeader trip={trip} onNavigate={onNavigate} message={message} />
        
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Analytics Section */}
          <AnalyticsCards analytics={analytics} trip={trip} />

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowPhotoModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  📸 Subir Foto
                </button>
                <button
                  onClick={() => trip.days.length > 0 && handleDayClick(trip.days[0])}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  💰 Agregar Gasto
                </button>
                <button
                  onClick={() => trip.days.length > 0 && handleDayClick(trip.days[0])}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  📝 Escribir Diario
                </button>
              </div>
            </div>
          </div>

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

        {/* Photo Upload Modal */}
        {showPhotoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Subir Foto</h3>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Día del viaje
                  </label>
                  <select
                    value={photoForm.associated_day_id}
                    onChange={(e) => setPhotoForm(prev => ({ ...prev, associated_day_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar día</option>
                    {trip.days.map(day => (
                      <option key={day.id} value={day.id}>
                        {new Date(day.date).toLocaleDateString()} - Día {trip.days.indexOf(day) + 1}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación (opcional)
                  </label>
                  <input
                    type="text"
                    value={photoForm.location}
                    onChange={(e) => setPhotoForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Ej: Torre Eiffel, París"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar archivo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={!photoForm.associated_day_id || uploadLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  {!photoForm.associated_day_id && (
                    <p className="text-sm text-red-600 mt-1">Primero selecciona un día</p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TripDetails