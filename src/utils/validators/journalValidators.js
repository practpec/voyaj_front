export const validateJournalContent = (content) => {
  if (!content) return 'Contenido requerido'
  if (content.length < 10) return 'Mínimo 10 caracteres'
  if (content.length > 5000) return 'Máximo 5000 caracteres'
  return null
}

export const validateEmotions = (emotions) => {
  if (!emotions || !Array.isArray(emotions)) return null
  
  const validEmotions = [
    'feliz', 'emocionado', 'relajado', 'agradecido', 'inspirado',
    'cansado', 'nostálgico', 'pensativo', 'aventurero', 'tranquilo'
  ]
  
  for (const emotion of emotions) {
    if (!validEmotions.includes(emotion)) {
      return `Emoción "${emotion}" no válida`
    }
  }
  
  if (emotions.length > 5) return 'Máximo 5 emociones'
  
  return null
}

export const validateRecommendations = (recommendations) => {
  if (!recommendations || !Array.isArray(recommendations)) return null
  
  const validTypes = ['lugar', 'actividad', 'comida', 'transporte', 'alojamiento']
  
  for (const rec of recommendations) {
    if (!rec.note || rec.note.length < 3) {
      return 'Nota de recomendación muy corta'
    }
    if (rec.note.length > 200) {
      return 'Nota de recomendación muy larga'
    }
    if (!validTypes.includes(rec.type)) {
      return `Tipo "${rec.type}" no válido`
    }
  }
  
  if (recommendations.length > 10) return 'Máximo 10 recomendaciones'
  
  return null
}

export const validateJournalForm = (data) => {
  const errors = {}
  
  const contentError = validateJournalContent(data.content)
  if (contentError) errors.content = contentError
  
  if (data.emotions) {
    const emotionsError = validateEmotions(data.emotions)
    if (emotionsError) errors.emotions = emotionsError
  }
  
  if (data.recommendations) {
    const recError = validateRecommendations(data.recommendations)
    if (recError) errors.recommendations = recError
  }
  
  return Object.keys(errors).length ? errors : null
}