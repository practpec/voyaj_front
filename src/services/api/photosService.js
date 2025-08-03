import { makeRequest } from './config.js'

export const photosService = {
  uploadPhoto: (tripId, formData) => 
    makeRequest(`/trips/${tripId}/photos`, {
      method: 'POST',
      headers: {},
      body: formData
    }),

  getTripPhotos: (tripId) => 
    makeRequest(`/trips/${tripId}/photos`),

  deletePhoto: (tripId, photoId) => 
    makeRequest(`/trips/${tripId}/photos/${photoId}`, {
      method: 'DELETE'
    }),

  getPhotosByDay: (tripId, dayId) => 
    makeRequest(`/trips/${tripId}/photos?day_id=${dayId}`),

  updatePhotoCaption: (tripId, photoId, caption) => 
    makeRequest(`/trips/${tripId}/photos/${photoId}`, {
      method: 'PUT',
      body: JSON.stringify({ caption })
    })
}