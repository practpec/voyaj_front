export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return 'Email requerido'
  if (!emailRegex.test(email)) return 'Email inválido'
  return null
}

export const validatePassword = (password) => {
  if (!password) return 'Contraseña requerida'
  if (password.length < 8) return 'Mínimo 8 caracteres'
  if (!/(?=.*[a-z])/.test(password)) return 'Debe incluir minúscula'
  if (!/(?=.*[A-Z])/.test(password)) return 'Debe incluir mayúscula'
  if (!/(?=.*\d)/.test(password)) return 'Debe incluir número'
  return null
}

export const validateName = (name) => {
  if (!name) return 'Nombre requerido'
  if (name.length < 2) return 'Mínimo 2 caracteres'
  if (name.length > 50) return 'Máximo 50 caracteres'
  return null
}

export const validateRegisterForm = (data) => {
  const errors = {}
  
  const emailError = validateEmail(data.email)
  if (emailError) errors.email = emailError
  
  const passwordError = validatePassword(data.password)
  if (passwordError) errors.password = passwordError
  
  const nameError = validateName(data.name)
  if (nameError) errors.name = nameError
  
  return Object.keys(errors).length ? errors : null
}

export const validateLoginForm = (data) => {
  const errors = {}
  
  if (!data.email) errors.email = 'Email requerido'
  if (!data.password) errors.password = 'Contraseña requerida'
  
  return Object.keys(errors).length ? errors : null
}

export const validatePasswordReset = (data) => {
  const errors = {}
  
  const emailError = validateEmail(data.email)
  if (emailError) errors.email = emailError
  
  if (data.token && !data.token.trim()) errors.token = 'Token requerido'
  
  if (data.new_password) {
    const passwordError = validatePassword(data.new_password)
    if (passwordError) errors.new_password = passwordError
  }
  
  return Object.keys(errors).length ? errors : null
}