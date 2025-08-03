import { useState } from 'react'

function PhotosGrid({ photos, onUpload, onDelete, uploadLoading }) {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [location, setLocation] = useState('')

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setShowUploadModal(true)
    }
  }

  const handleUpload = (file, locationValue) => {
    onUpload(file, locationValue)
    setShowUploadModal(false)
    setLocation('')
  }

  return (
    <div className="bg-background rounded-xl shadow-xl border border-border-default p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-default">Fotos ({photos.length})</h2>
        <div className="flex items-center">
          <label className="flex items-center px-6 py-3 bg-primary text-background rounded-full cursor-pointer hover:bg-primary-hover transition-all duration-200 hover:-translate-y-0.5 shadow-lg font-semibold">
            📤 {uploadLoading ? 'Subiendo...' : 'Subir Foto'}
            <input
              type="file"
              accept="image/*"
              disabled={uploadLoading}
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Modal de ubicación */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-default">Agregar Ubicación</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-text-muted hover:text-text-default"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-default mb-2">
                  Ubicación (opcional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej: Torre Eiffel, París"
                  className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 border border-border-default text-text-default rounded-lg hover:bg-background-alt transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleUpload(document.querySelector('input[type="file"]').files[0], location)}
                className="flex-1 px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary-hover transition-colors font-semibold"
              >
                Subir
              </button>
            </div>
          </div>
        </div>
      )}

      {photos.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">📷</div>
          <p className="text-text-default text-lg font-medium mb-2">No hay fotos aún</p>
          <p className="text-text-muted">Sube tu primera foto del viaje</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map(photo => (
            <div key={photo.id} className="relative group bg-background-alt rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src={photo.file_url} 
                alt="Foto del viaje"
                className="w-full h-48 object-cover"
              />
              
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end">
                <div className="w-full p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  {photo.location && (
                    <div className="flex items-center text-background text-sm mb-1 font-medium">
                      📍 {photo.location}
                    </div>
                  )}
                  {photo.taken_at && (
                    <div className="flex items-center text-background text-sm font-medium">
                      📅 {new Date(photo.taken_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => onDelete(photo.id)}
                className="absolute top-3 right-3 p-2 bg-red-500 text-background rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:-translate-y-0.5 shadow-lg"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PhotosGrid