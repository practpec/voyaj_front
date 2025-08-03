const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const getAuthHeaders = () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      console.log('[API] No token found')
      return {}
    }
    
    // Limpiar token de comillas extra y espacios
    const cleanToken = token.replace(/^["']|["']$/g, '').trim()
    console.log('[API] Token found, length:', cleanToken.length)
    return { Authorization: `Bearer ${cleanToken}` }
  } catch (error) {
    console.error('[API] [ERROR] Token retrieval failed:', error)
    return {}
  }
}

export const handleApiError = (error) => {
  console.error('[API] [ERROR]:', error)
  if (error.detail) return error.detail
  if (error.message) return error.message
  return 'Error de conexión'
}

export const makeRequest = async (url, options = {}) => {
  const authHeaders = getAuthHeaders()
  
  console.log('[API] Making request to:', url)
  console.log('[API] Auth headers:', authHeaders)
  
  try {
    const config = {
      method: options.method || 'GET',
      headers: {
        ...authHeaders,
        ...options.headers,
      },
      ...options,
    }

    // CRÍTICO: Solo agregar Content-Type si NO es FormData
    if (!(options.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
    }
    // Si es FormData, el browser maneja Content-Type automáticamente

    console.log('[API] Request config:', {
      url: `${API_BASE_URL}${url}`,
      method: config.method,
      hasAuth: !!authHeaders.Authorization,
      isFormData: options.body instanceof FormData
    })

    const response = await fetch(`${API_BASE_URL}${url}`, config)

    console.log('[API] Response status:', response.status)

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { detail: `HTTP ${response.status}: ${response.statusText}` }
      }
      
      console.error('[API] Error response:', errorData)
      
      // Si es 401, limpiar tokens y redirigir al login
      if (response.status === 401) {
        console.log('[API] 401 detected, clearing tokens')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.reload()
      }
      
      throw errorData
    }

    // Manejar respuestas vacías (como DELETE)
    if (response.status === 204) {
      return null
    }

    const data = await response.json()
    console.log('[API] Success response received')
    return data
  } catch (error) {
    console.error('[API] Request failed:', error)
    throw handleApiError(error)
  }
}