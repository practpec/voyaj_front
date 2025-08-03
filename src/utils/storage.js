export const storage = {
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`[STORAGE] [ERROR] Failed to set ${key}:`, error)
      return false
    }
  },

  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`[STORAGE] [ERROR] Failed to get ${key}:`, error)
      return defaultValue
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`[STORAGE] [ERROR] Failed to remove ${key}:`, error)
      return false
    }
  },

  clearAll: () => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('[STORAGE] [ERROR] Failed to clear:', error)
      return false
    }
  },

  // Métodos específicos para auth
  setAuthTokens: (tokens) => {
    const success = storage.setItem('access_token', tokens.access_token)
    if (tokens.refresh_token) {
      storage.setItem('refresh_token', tokens.refresh_token)
    }
    return success
  },

  getAuthToken: () => storage.getItem('access_token'),

  removeAuthTokens: () => {
    storage.removeItem('access_token')
    storage.removeItem('refresh_token')
  },

  // Métodos específicos para user
  setUser: (user) => storage.setItem('user', user),
  getUser: () => storage.getItem('user'),
  removeUser: () => storage.removeItem('user')
}