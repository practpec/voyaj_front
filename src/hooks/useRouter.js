import { useState, useEffect, useCallback } from 'react'

// Configuración de rutas
const ROUTES = {
  // Rutas públicas
  HOME: 'home',
  LOGIN: 'login', 
  REGISTER: 'register',
  VERIFY_EMAIL: 'verify-email',
  RESET_PASSWORD: 'reset-password',
  
  // Rutas autenticadas
  DASHBOARD: 'dashboard',
  PROFILE: 'profile',
  TRIP_DETAILS: 'trip-details',
  SUBSCRIPTION: 'subscription'
}

const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER, 
  ROUTES.VERIFY_EMAIL,
  ROUTES.RESET_PASSWORD
]

export const useRouter = () => {
  const [currentPage, setCurrentPage] = useState(ROUTES.HOME)
  const [routeData, setRouteData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Función para obtener la ruta desde la URL
  const getPageFromUrl = useCallback(() => {
    const path = window.location.pathname
    const hash = window.location.hash

    // Si hay hash, usarlo
    if (hash) {
      const page = hash.replace('#', '').split('/')[0]
      return page || ROUTES.HOME
    }

    // Si hay path, usarlo
    if (path && path !== '/') {
      const page = path.replace('/', '').split('/')[0]
      return page || ROUTES.HOME
    }

    return ROUTES.HOME
  }, [])

  // Función para actualizar la URL
  const updateUrl = useCallback((page, data = null) => {
    let url = `/${page}`
    
    // Agregar parámetros si es necesario
    if (data?.tripId) {
      url += `/${data.tripId}`
    }
    
    // Actualizar URL sin recargar
    window.history.pushState({ page, data }, '', url)
  }, [])

  // Función principal para navegar
  const navigate = useCallback((page, data = null) => {
    if (!page) {
      console.warn('Navigate called without page')
      return
    }

    // Validar que la página existe
    const validPages = Object.values(ROUTES)
    if (!validPages.includes(page)) {
      console.warn(`Unknown page: ${page}`)
      return
    }

    setCurrentPage(page)
    setRouteData(data)
    updateUrl(page, data)
  }, [updateUrl])

  // Función para ir atrás
  const goBack = useCallback(() => {
    window.history.back()
  }, [])

  // Función para reemplazar la ruta actual
  const replace = useCallback((page, data = null) => {
    setCurrentPage(page)
    setRouteData(data)
    
    let url = `/${page}`
    if (data?.tripId) {
      url += `/${data.tripId}`
    }
    
    window.history.replaceState({ page, data }, '', url)
  }, [])

  // Verificar si una ruta es pública
  const isPublicRoute = useCallback((page) => {
    return PUBLIC_ROUTES.includes(page)
  }, [])

  // Verificar si una ruta está activa
  const isActive = useCallback((page) => {
    return currentPage === page
  }, [currentPage])

  // Inicializar router
  useEffect(() => {
    const initialPage = getPageFromUrl()
    setCurrentPage(initialPage)
    setIsLoading(false)

    // Si no hay estado en el historial, establecerlo
    if (!window.history.state) {
      window.history.replaceState({ page: initialPage }, '', window.location.pathname)
    }
  }, [getPageFromUrl])

  // Escuchar cambios en el historial (botones atrás/adelante)
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state?.page) {
        setCurrentPage(event.state.page)
        setRouteData(event.state.data || null)
      } else {
        // Fallback a parsear URL
        const page = getPageFromUrl()
        setCurrentPage(page)
        setRouteData(null)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [getPageFromUrl])

  return {
    currentPage,
    routeData,
    navigate,
    goBack,
    replace,
    isPublicRoute,
    isActive,
    isLoading,
    ROUTES
  }
}