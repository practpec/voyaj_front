const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:8000'

export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const handleApiError = (error) => {
  console.error('[API Error]:', error)
  if (error.detail) return error.detail
  if (error.message) return error.message
  return 'Error de conexión'
}

export const makeRequest = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw errorData
    }

    return await response.json()
  } catch (error) {
    throw handleApiError(error)
  }
}