export const validateFriendRequestData = (data) => {
  const errors = {}
  
  if (!data.target_user_id) {
    errors.target_user_id = 'Usuario destino requerido'
  }
  
  if (data.message && data.message.length > 500) {
    errors.message = 'Mensaje muy largo (máximo 500 caracteres)'
  }
  
  return Object.keys(errors).length ? errors : null
}

export const validateFriendResponse = (response) => {
  const validResponses = ['accept', 'reject']
  
  if (!response) return 'Respuesta requerida'
  if (!validResponses.includes(response)) {
    return 'Respuesta debe ser "accept" o "reject"'
  }
  
  return null
}

export const validateFriendResponseForm = (data) => {
  const errors = {}
  
  const responseError = validateFriendResponse(data.response)
  if (responseError) errors.response = responseError
  
  return Object.keys(errors).length ? errors : null
}