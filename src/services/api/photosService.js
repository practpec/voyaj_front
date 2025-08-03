import { makeRequest } from './config.js'

export const photosService = {
  // Solo el upload que funciona
  uploadPhoto: (tripId, formData) => 
    makeRequest(`/trips/${tripId}/photos/upload`, {
      method: 'POST',
      body: formData
    }),

  getTripPhotos: (tripId) => 
    makeRequest(`/trips/${tripId}/photos`),

  deletePhoto: (tripId, photoId) => 
    makeRequest(`/trips/${tripId}/photos/${photoId}`, {
      method: 'DELETE'
    }),

  getPhotosByDay: (tripId) => 
    makeRequest(`/trips/${tripId}/photos/by-day`),

  getPhotoDetails: (tripId, photoId) => 
    makeRequest(`/trips/${tripId}/photos/${photoId}`)
}