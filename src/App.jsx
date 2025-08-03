import { useState, useEffect } from 'react'
import { storage } from './utils/storage.js'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import TripDetails from './pages/TripDetails.jsx'
import Subscription from './pages/Subscription.jsx'

function App() {
  const [page, setPage] = useState('login')
  const [user, setUser] = useState(null)
  const [tripId, setTripId] = useState(null)

  useEffect(() => {
    const token = storage.getAuthToken()
    const savedUser = storage.getUser()
    if (token && savedUser) {
      setUser(savedUser)
      setPage('dashboard')
    }
  }, [])

  const navigate = (newPage, data = null) => {
    setPage(newPage)
    if (data?.tripId) setTripId(data.tripId)
  }

  const logout = () => {
    storage.removeAuthTokens()
    storage.removeUser()
    setUser(null)
    setPage('login')
  }

  if (!user) {
    return (
      <div>
        {page === 'login' && <Login onNavigate={navigate} setUser={setUser} />}
        {page === 'register' && <Register onNavigate={navigate} setUser={setUser} />}
        {page === 'verify-email' && <VerifyEmail onNavigate={navigate} />}
        {page === 'reset-password' && <ResetPassword onNavigate={navigate} />}
      </div>
    )
  }

  return (
    <div>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <button onClick={() => navigate('dashboard')}>Dashboard</button>
        <button onClick={() => navigate('profile')}>Perfil</button>
        <button onClick={() => navigate('subscription')}>Suscripción</button>
        <button onClick={logout}>Salir</button>
        <span style={{ marginLeft: '20px' }}>Hola, {user.name}</span>
      </nav>

      {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
      {page === 'profile' && <Profile user={user} setUser={setUser} />}
      {page === 'subscription' && <Subscription />}
      {page === 'trip-details' && tripId && <TripDetails tripId={tripId} onNavigate={navigate} />}
    </div>
  )
}

export default App