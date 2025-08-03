export const authErrorHandler = (error) => {
  const authMessages = {
    'Invalid credentials': 'Credenciales incorrectas',
    'User already exists': 'Usuario ya existe',
    'Email not verified': 'Email no verificado',
    'Invalid token': 'Token inválido o expirado',
    'Token expired': 'Sesión expirada',
    'User not found': 'Usuario no encontrado'
  }
  
  return authMessages[error] || 'Error de autenticación'
}

export const tripErrorHandler = (error) => {
  const tripMessages = {
    'Trip not found': 'Viaje no encontrado',
    'User not authorized': 'Sin permisos para este viaje',
    'Invalid date range': 'Rango de fechas inválido',
    'Budget exceeded': 'Presupuesto excedido',
    'Activity not found': 'Actividad no encontrada',
    'Already invited': 'Usuario ya invitado'
  }
  
  return tripMessages[error] || 'Error en viaje'
}

export const expenseErrorHandler = (error) => {
  const expenseMessages = {
    'Expense not found': 'Gasto no encontrado',
    'Invalid amount': 'Monto inválido',
    'Currency not supported': 'Moneda no soportada',
    'Split amounts invalid': 'División de gastos inválida',
    'Cannot delete expense': 'No se puede eliminar el gasto'
  }
  
  return expenseMessages[error] || 'Error en gasto'
}

export const photoErrorHandler = (error) => {
  const photoMessages = {
    'File too large': 'Archivo muy grande (máx 5MB)',
    'Invalid file type': 'Tipo de archivo no válido',
    'Photo not found': 'Foto no encontrada',
    'Upload failed': 'Error al subir foto',
    'Storage limit exceeded': 'Límite de almacenamiento excedido'
  }
  
  return photoMessages[error] || 'Error en foto'
}

export const subscriptionErrorHandler = (error) => {
  const subMessages = {
    'PRO subscription required': 'Suscripción PRO requerida',
    'Payment failed': 'Pago falló',
    'Invalid plan': 'Plan inválido',
    'Already subscribed': 'Ya tienes suscripción activa',
    'Subscription not found': 'Suscripción no encontrada'
  }
  
  return subMessages[error] || 'Error en suscripción'
}

export const generalErrorHandler = (error, context = 'general') => {
  // Manejo específico por contexto
  switch (context) {
    case 'auth':
      return authErrorHandler(error)
    case 'trips':
      return tripErrorHandler(error)
    case 'expenses':
      return expenseErrorHandler(error)
    case 'photos':
      return photoErrorHandler(error)
    case 'subscriptions':
      return subscriptionErrorHandler(error)
    default:
      return error || 'Error desconocido'
  }
}