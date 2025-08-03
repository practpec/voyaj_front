export const validateAmount = (amount) => {
  if (!amount) return 'Monto requerido'
  const numAmount = parseFloat(amount)
  if (isNaN(numAmount)) return 'Debe ser número válido'
  if (numAmount <= 0) return 'Debe ser mayor a 0'
  if (numAmount > 100000) return 'Máximo $100,000'
  return null
}

export const validateDescription = (description) => {
  if (!description) return 'Descripción requerida'
  if (description.length < 3) return 'Mínimo 3 caracteres'
  if (description.length > 500) return 'Máximo 500 caracteres'
  return null
}

export const validateExpenseDate = (date) => {
  if (!date) return 'Fecha requerida'
  const expenseDate = new Date(date)
  const today = new Date()
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(today.getFullYear() - 1)
  
  if (expenseDate > today) return 'No puede ser fecha futura'
  if (expenseDate < oneYearAgo) return 'Máximo 1 año atrás'
  return null
}

export const validateCategory = (category) => {
  const validCategories = [
    'transporte', 'alojamiento', 'comida', 'actividades', 
    'compras', 'otros'
  ]
  if (!category) return 'Categoría requerida'
  if (!validCategories.includes(category)) return 'Categoría inválida'
  return null
}

export const validateCurrency = (currency) => {
  const validCurrencies = ['USD', 'EUR', 'MXN', 'JPY', 'GBP']
  if (!currency) return 'Moneda requerida'
  if (!validCurrencies.includes(currency)) return 'Moneda no soportada'
  return null
}

export const validateExpenseForm = (data) => {
  const errors = {}
  
  const amountError = validateAmount(data.amount)
  if (amountError) errors.amount = amountError
  
  const descError = validateDescription(data.description)
  if (descError) errors.description = descError
  
  const dateError = validateExpenseDate(data.date)
  if (dateError) errors.date = dateError
  
  const categoryError = validateCategory(data.category)
  if (categoryError) errors.category = categoryError
  
  const currencyError = validateCurrency(data.currency)
  if (currencyError) errors.currency = currencyError
  
  return Object.keys(errors).length ? errors : null
}