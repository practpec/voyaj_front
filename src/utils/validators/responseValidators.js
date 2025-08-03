export const validateAuthResponse = (response) => {
  if (!response) return { isValid: false, error: 'Respuesta vacía' }
  
  const required = ['access_token', 'user']
  for (const field of required) {
    if (!response[field]) {
      return { isValid: false, error: `Campo ${field} faltante` }
    }
  }
  
  if (!response.user.id || !response.user.email) {
    return { isValid: false, error: 'Datos de usuario incompletos' }
  }
  
  return { isValid: true }
}

export const validateTripResponse = (response) => {
  if (!response) return { isValid: false, error: 'Respuesta vacía' }
  
  const required = ['id', 'title', 'start_date', 'end_date', 'created_by']
  for (const field of required) {
    if (!response[field]) {
      return { isValid: false, error: `Campo ${field} faltante` }
    }
  }
  
  return { isValid: true }
}

export const validateExpenseResponse = (response) => {
  if (!response) return { isValid: false, error: 'Respuesta vacía' }
  
  const required = ['id', 'amount', 'description', 'date', 'currency']
  for (const field of required) {
    if (response[field] === undefined || response[field] === null) {
      return { isValid: false, error: `Campo ${field} faltante` }
    }
  }
  
  return { isValid: true }
}

export const validateSubscriptionResponse = (response) => {
  if (!response) return { isValid: false, error: 'Respuesta vacía' }
  
  if (typeof response.is_pro !== 'boolean') {
    return { isValid: false, error: 'Estado PRO inválido' }
  }
  
  return { isValid: true }
}

export const validateErrorResponse = (error) => {
  // Manejo de errores de middleware
  const middlewareErrors = {
    'Requiere Autorización': 'Sesión expirada',
    'Token Invalido': 'Sesión inválida',
    'Email no verificado': 'Verifica tu email',
    'PRO subscription required': 'Suscripción PRO requerida'
  }
  
  if (typeof error === 'string' && middlewareErrors[error]) {
    return middlewareErrors[error]
  }
  
  if (error?.detail && middlewareErrors[error.detail]) {
    return middlewareErrors[error.detail]
  }
  
  return error?.detail || error?.message || 'Error desconocido'
}