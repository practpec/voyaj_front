import { makeRequest } from './config.js'

export const authService = {
  register: (userData) => 
    makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  login: (credentials) => 
    makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  getProfile: () => 
    makeRequest('/auth/profile'),

  searchUsers: (query) => 
    makeRequest(`/auth/search?q=${encodeURIComponent(query)}`),

  sendVerificationEmail: () => 
    makeRequest('/auth/send-verification', { method: 'POST' }),

  verifyEmail: (data) => 
    makeRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  sendPasswordReset: (email) => 
    makeRequest('/auth/send-password-reset', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),

  resetPassword: (data) => 
    makeRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  uploadProfilePhoto: (file) => {
    const formData = new FormData()
    formData.append('file', file)
  
    return makeRequest('/auth/upload-profile-photo', {
      method: 'POST',
      body: formData
      // NO especificar headers aquí, makeRequest los maneja correctamente
    })
  }
}