export const validatePhotoFile = (file) => {
  if (!file) return 'Archivo requerido'
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return 'Solo JPEG, PNG o WebP permitidos'
  }
  
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) return 'Máximo 5MB'
  
  return null
}

export const validatePhotoCaption = (caption) => {
  if (!caption) return null
  if (caption.length > 500) return 'Máximo 500 caracteres'
  return null
}

export const validatePhotoUpload = (formData) => {
  const errors = {}
  
  const file = formData.get('file')
  const fileError = validatePhotoFile(file)
  if (fileError) errors.file = fileError
  
  const caption = formData.get('caption')
  if (caption) {
    const captionError = validatePhotoCaption(caption)
    if (captionError) errors.caption = captionError
  }
  
  return Object.keys(errors).length ? errors : null
}