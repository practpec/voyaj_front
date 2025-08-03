import { makeRequest } from './config.js'

export const friendshipsService = {
  sendFriendRequest: (userData) => 
    makeRequest('/friendships/requests', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  getFriendRequests: () => 
    makeRequest('/friendships/requests'),

  respondToRequest: (requestId, response) => 
    makeRequest(`/friendships/requests/${requestId}/respond`, {
      method: 'POST',
      body: JSON.stringify(response)
    }),

  getFriends: () => 
    makeRequest('/friendships/'),

  removeFriend: (friendId) => 
    makeRequest(`/friendships/${friendId}`, {
      method: 'DELETE'
    })
}