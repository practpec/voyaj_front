import { makeRequest } from './config.js'

export const expensesService = {
  createExpense: (tripId, expenseData) => 
    makeRequest(`/trips/${tripId}/expenses`, {
      method: 'POST',
      body: JSON.stringify(expenseData)
    }),

  getTripExpenses: (tripId) => 
    makeRequest(`/trips/${tripId}/expenses`),

  updateExpense: (tripId, expenseId, updates) => 
    makeRequest(`/trips/${tripId}/expenses/${expenseId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),

  deleteExpense: (tripId, expenseId) => 
    makeRequest(`/trips/${tripId}/expenses/${expenseId}`, {
      method: 'DELETE'
    }),

  getExpenseSummary: (tripId, filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString()
    return makeRequest(`/trips/${tripId}/expenses/summary${queryParams ? '?' + queryParams : ''}`)
  }
}