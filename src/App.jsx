import { useState, useEffect } from 'react'
import { useRouter } from './hooks/useRouter.js'
import { storage } from './utils/storage.js'

// Páginas con diseño Tailwind
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'

// Páginas temporales (crear después)
import Home from './pages/Home.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import TripDetails from './pages/TripDetails.jsx'
import Trips from './pages/Trips.jsx'
import Friends from './pages/Friends.jsx'

// Componente de carga
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-background-soft via-background to-accent font-sans flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="text-6xl animate-bounce">🧳</div>
      <div className="text-lg text-text-muted">Cargando Voyaj...</div>
    </div>
  </div>
)

// Componente 404
const NotFound = ({ navigate }) => (
  <div className="min-h-screen bg-gradient-to-br from-background-soft via-background to-accent font-sans flex items-center justify-center">
    <div className="text-center space-y-6 max-w-md mx-auto px-6">
      <div className="text-8xl">🗺️</div>
      <h1 className="text-3xl font-bold text-text-default">Página no encontrada</h1>
      <p className="text-lg text-text-muted">
        Parece que esta página se fue de viaje y no ha vuelto.
      </p>
      <button 
        onClick={() => navigate('login')}
        className="bg-primary text-white font-semibold py-3 px-8 rounded-full hover:bg-primary-hover hover:-translate-y-0.5 transform transition-all duration-300 shadow-card hover:shadow-elevated"
      >
        Volver al inicio
      </button>
    </div>
  </div>
)

function App() {
  const { currentPage, routeData, navigate, isPublicRoute, isLoading: routerLoading, ROUTES } = useRouter()
  const [user, setUser] = useState(null)
  const [isUserLoading, setIsUserLoading] = useState(true)

  // Inicializar usuario desde storage
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const token = storage.getAuthToken()
        const savedUser = storage.getUser()
        
        if (token && savedUser) {
          setUser(savedUser)
          // CORREGIDO: Solo redirigir al dashboard si está en página pública 
          // PERO NO si está en verify-email (necesita verificar primero)
          if (isPublicRoute(currentPage) && currentPage !== ROUTES.VERIFY_EMAIL) {
            navigate(ROUTES.DASHBOARD)
          }
        }
      } catch (error) {
        console.error('Error initializing user:', error)
      } finally {
        setIsUserLoading(false)
      }
    }

    initializeUser()
  }, [currentPage, isPublicRoute, navigate, ROUTES.DASHBOARD, ROUTES.VERIFY_EMAIL])

  // Función para manejar login exitoso
  const handleLogin = (userData) => {
    setUser(userData)
    navigate(ROUTES.DASHBOARD)
  }

  // Función para manejar logout
  const handleLogout = () => {
    storage.removeAuthTokens()
    storage.removeUser()
    setUser(null)
    navigate(ROUTES.LOGIN)
  }

  // Mostrar loading mientras se inicializa
  if (routerLoading || isUserLoading) {
    return <LoadingScreen />
  }

  // Proteger rutas autenticadas
  const requireAuth = (component) => {
    if (!user && !isPublicRoute(currentPage)) {
      return <Login onNavigate={navigate} setUser={handleLogin} />
    }
    return component
  }

  // Renderizar páginas
  const renderPage = () => {
    switch (currentPage) {
      // Páginas públicas
      case ROUTES.HOME:
        return <Home onNavigate={navigate} />
      
      case ROUTES.LOGIN:
        // Si ya está logueado, redirigir al dashboard
        if (user) {
          navigate(ROUTES.DASHBOARD)
          return <LoadingScreen />
        }
        return <Login onNavigate={navigate} setUser={handleLogin} />
      
      case ROUTES.REGISTER:
        // CORREGIDO: Solo redirigir si está logueado Y ya verificó email
        // Si tiene user pero email no verificado, permitir acceso a register para que pueda ir a verify
        if (user && user.email_verified) {
          navigate(ROUTES.DASHBOARD)
          return <LoadingScreen />
        }
        return <Register onNavigate={navigate} setUser={setUser} />
      
      case ROUTES.RESET_PASSWORD:
        return <ForgotPassword onNavigate={navigate} />
      
      case ROUTES.VERIFY_EMAIL:
        // CORREGIDO: Permitir acceso a verify-email incluso si hay user
        return <VerifyEmail onNavigate={navigate} user={user} />

      // Páginas autenticadas
      case ROUTES.DASHBOARD:
        return requireAuth(
          <Dashboard 
            user={user} 
            onNavigate={navigate} 
            onLogout={handleLogout} 
          />
        )
      
      case ROUTES.PROFILE:
        return requireAuth(
          <Profile 
            user={user} 
            setUser={setUser}
            onNavigate={navigate} 
            onLogout={handleLogout} 
          />
        )
      
      case ROUTES.TRIP_DETAILS:
        return requireAuth(
          <TripDetails 
            tripId={routeData?.tripId}
            user={user}
            onNavigate={navigate} 
            onLogout={handleLogout}
          />
        )
      
      case ROUTES.TRIPS:
        return requireAuth(
          <Trips 
            user={user}
            onNavigate={navigate} 
            onLogout={handleLogout}
          />
        )

        case ROUTES.FRIENDS:
        return requireAuth(
          <Friends 
            user={user}
            onNavigate={navigate} 
            onLogout={handleLogout}
          />
        )

      default:
        return <NotFound navigate={navigate} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {renderPage()}
    </div>
  )
}

export default App