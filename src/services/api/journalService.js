import { makeRequest } from './config.js'

export const journalService = {
  createEntry: (tripId, entryData) => 
    makeRequest(`/trips/${tripId}/journal-entries`, {
      method: 'POST',
      body: JSON.stringify(entryData)
    }),

  getTripEntries: (tripId) => 
    makeRequest(`/trips/${tripId}/journal-entries`),

  getEntry: (tripId, entryId) => 
    makeRequest(`/trips/${tripId}/journal-entries/${entryId}`),

  updateEntry: (tripId, entryId, updates) => 
    makeRequest(`/trips/${tripId}/journal-entries/${entryId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),

  searchEntries: (tripId, query) => 
    makeRequest(`/trips/${tripId}/journal-entries/search?q=${encodeURIComponent(query)}`)
}