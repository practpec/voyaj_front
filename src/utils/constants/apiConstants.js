export const EXPENSE_CATEGORIES = [
  'transporte',
  'alojamiento', 
  'comida',
  'actividades',
  'compras',
  'otros'
]

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'Dólar Estadounidense' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'MXN', symbol: '$', name: 'Peso Mexicano' },
  { code: 'JPY', symbol: '¥', name: 'Yen Japonés' },
  { code: 'GBP', symbol: '£', name: 'Libra Esterlina' }
]

export const EMOTIONS = [
  'feliz',
  'emocionado',
  'relajado',
  'agradecido',
  'inspirado',
  'cansado',
  'nostálgico',
  'pensativo',
  'aventurero',
  'tranquilo'
]

export const RECOMMENDATION_TYPES = [
  'lugar',
  'actividad',
  'comida',
  'transporte',
  'alojamiento'
]

export const SUBSCRIPTION_PLANS = [
  { id: 'aventurero', name: 'Aventurero', price: 24.99 },
  { id: 'nomada', name: 'Nómada', price: 49.99 }
]

export const PHOTO_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxFiles: 10
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
}