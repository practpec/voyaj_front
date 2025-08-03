export const validateTripTitle = (title) => {
  if (!title) return 'Título requerido'
  if (title.length < 3) return 'Mínimo 3 caracteres'
  if (title.length > 100) return 'Máximo 100 caracteres'
  return null
}

export const validateTripDates = (startDate, endDate) => {
  const errors = {}
  
  if (!startDate) errors.start_date = 'Fecha inicio requerida'
  if (!endDate) errors.end_date = 'Fecha fin requerida'
  
  if (startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (start < today) errors.start_date = 'Fecha no puede ser pasada'
    if (end <= start) errors.end_date = 'Debe ser posterior al inicio'
  }
  
  return Object.keys(errors).length ? errors : null
}

export const validateBudget = (budget) => {
  if (!budget) return null
  const numBudget = parseFloat(budget)
  if (isNaN(numBudget)) return 'Debe ser número válido'
  if (numBudget < 0) return 'Debe ser positivo'
  if (numBudget > 1000000) return 'Máximo $1,000,000'
  return null
}

export const validateCreateTripForm = (data) => {
  const errors = {}
  
  const titleError = validateTripTitle(data.title)
  if (titleError) errors.title = titleError
  
  const dateErrors = validateTripDates(data.start_date, data.end_date)
  if (dateErrors) Object.assign(errors, dateErrors)
  
  if (data.estimated_total_budget) {
    const budgetError = validateBudget(data.estimated_total_budget)
    if (budgetError) errors.estimated_total_budget = budgetError
  }
  
  return Object.keys(errors).length ? errors : null
}

export const validateActivity = (data) => {
  const errors = {}
  
  if (!data.title) errors.title = 'Título requerido'
  if (data.title && data.title.length > 200) errors.title = 'Máximo 200 caracteres'
  
  if (data.estimated_cost) {
    const costError = validateBudget(data.estimated_cost)
    if (costError) errors.estimated_cost = costError
  }
  
  if (!data.start_time) errors.start_time = 'Hora inicio requerida'
  
  return Object.keys(errors).length ? errors : null
}