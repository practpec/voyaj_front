function PhotosGrid({ photos, onUpload, onDelete, uploadLoading }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Fotos ({photos.length})</h2>
        <div className="flex items-center">
          <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
            📤 {uploadLoading ? 'Subiendo...' : 'Subir Foto'}
            <input
              type="file"
              accept="image/*"
              disabled={uploadLoading}
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) onUpload(file)
              }}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📷</div>
          <p className="text-gray-500">No hay fotos aún</p>
          <p className="text-sm text-gray-400">Sube tu primera foto del viaje</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className="relative group bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={photo.file_url} 
                alt="Foto del viaje"
                className="w-full h-48 object-cover"
              />
              
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-end">
                <div className="w-full p-3 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  {photo.location && (
                    <div className="flex items-center text-white text-xs mb-1">
                      📍 {photo.location}
                    </div>
                  )}
                  {photo.taken_at && (
                    <div className="flex items-center text-white text-xs">
                      📅 {new Date(photo.taken_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => onDelete(photo.id)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
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