export const validateSubscriptionPlan = (plan) => {
  const validPlans = ['aventurero', 'nomada']
  
  if (!plan) return 'Plan requerido'
  if (!validPlans.includes(plan)) {
    return 'Plan debe ser "aventurero" o "nomada"'
  }
  
  return null
}

export const validatePaymentData = (data) => {
  const errors = {}
  
  const planError = validateSubscriptionPlan(data.plan)
  if (planError) errors.plan = planError
  
  if (data.success_url && !data.success_url.startsWith('http')) {
    errors.success_url = 'URL de éxito inválida'
  }
  
  if (data.failure_url && !data.failure_url.startsWith('http')) {
    errors.failure_url = 'URL de fallo inválida'
  }
  
  return Object.keys(errors).length ? errors : null
}