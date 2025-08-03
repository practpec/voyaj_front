function TripHeader({ trip, onNavigate, message }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <button 
        onClick={() => onNavigate('dashboard')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        ← Volver
      </button>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{trip.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-gray-600">
            <div className="flex items-center">
              📅 {trip.start_date} a {trip.end_date}
            </div>
            <div className="flex items-center">
              👥 {trip.members.length} miembros
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded-lg ${
          message.includes('Error') 
            ? 'bg-red-50 border border-red-200 text-red-700' 
            : 'bg-green-50 border border-green-200 text-green-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  )
}

export default TripHeader