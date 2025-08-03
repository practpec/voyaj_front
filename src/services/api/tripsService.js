import { makeRequest } from './config.js'

export const tripsService = {
  createTrip: (tripData) => 
    makeRequest('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData)
    }),

  getUserTrips: () => 
    makeRequest('/trips'),

  getTripDetails: (tripId) => 
    makeRequest(`/trips/${tripId}`),

  updateTrip: (tripId, updates) => 
    makeRequest(`/trips/${tripId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),

  deleteTrip: (tripId) => 
    makeRequest(`/trips/${tripId}`, { method: 'DELETE' }),

  getTripAnalytics: (tripId) => 
    makeRequest(`/trips/${tripId}/analytics`),

  exportTripData: (tripId) => 
    makeRequest(`/trips/${tripId}/export`, {
      headers: { Accept: 'application/pdf' }
    }),

  inviteMember: (tripId, memberData) => 
    makeRequest(`/trips/${tripId}/invite`, {
      method: 'POST',
      body: JSON.stringify(memberData)
    }),

  respondToInvitation: (tripId, response) => 
    makeRequest(`/trips/${tripId}/respond-invitation`, {
      method: 'POST',
      body: JSON.stringify(response)
    }),

  createActivity: (tripId, activityData) => 
    makeRequest(`/trips/${tripId}/activities`, {
      method: 'POST',
      body: JSON.stringify(activityData)
    }),

  updateActivity: (tripId, activityId, updates) => 
    makeRequest(`/trips/${tripId}/activities/${activityId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),

  deleteActivity: (tripId, activityId) => 
    makeRequest(`/trips/${tripId}/activities/${activityId}`, {
      method: 'DELETE'
    })
}