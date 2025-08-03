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
    console.log('[AUTH_SERVICE] Uploading photo:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    })
    
    const formData = new FormData()
    formData.append('file', file)
    
    // Debug: Verificar token antes del upload
    const token = localStorage.getItem('access_token')
    console.log('[AUTH_SERVICE] Token for upload:', {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenStart: token?.substring(0, 20)
    })
    
    return makeRequest('/auth/upload-profile-photo', {
      method: 'POST',
      body: formData
    })
  }
}