import { makeRequest } from './config.js'

export const friendshipsService = {
  sendFriendRequest: (userData) => 
    makeRequest('/friendships/send-request', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  getFriendRequests: () => 
    makeRequest('/friendships/requests'),

  respondToRequest: (requestId, response) => 
    makeRequest(`/friendships/respond/${requestId}`, {
      method: 'POST',
      body: JSON.stringify(response)
    }),

  getFriends: () => 
    makeRequest('/friendships/friends'),

  removeFriend: (friendId) => 
    makeRequest(`/friendships/remove/${friendId}`, {
      method: 'DELETE'
    })
}