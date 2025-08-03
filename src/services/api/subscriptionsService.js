import { makeRequest } from './config.js'

export const subscriptionsService = {
  getSubscriptionStatus: () => 
    makeRequest('/subscriptions/status'),

  createPayment: (plan) => 
    makeRequest('/subscriptions/create-payment', {
      method: 'POST',
      body: JSON.stringify({ plan })
    }),

  cancelSubscription: () => 
    makeRequest('/subscriptions/cancel', { method: 'POST' }),

  getPaymentHistory: () => 
    makeRequest('/subscriptions/payment-history'),

  getPaymentStatistics: () => 
    makeRequest('/subscriptions/payment-statistics')
}