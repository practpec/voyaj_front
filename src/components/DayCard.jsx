function DayCard({ day, onDayClick }) {
  const formattedDate = new Date(day.date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div 
      onClick={() => onDayClick(day)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-lg mr-2">📅</span>
          <h3 className="text-lg font-semibold text-gray-900 capitalize">{formattedDate}</h3>
        </div>
        <span className="text-gray-400">→</span>
      </div>

      {day.notes && (
        <p className="text-gray-600 mb-4 text-sm">{day.notes}</p>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Actividades:</span>
          <span className="font-medium text-gray-900">{day.activities.length}</span>
        </div>

        {day.activities.length > 0 && (
          <div className="mt-3 space-y-2">
            {day.activities.slice(0, 2).map(activity => (
              <div key={activity.id} className="bg-gray-50 rounded p-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900 text-sm">{activity.title}</h4>
                  {activity.start_time && (
                    <div className="flex items-center text-xs text-gray-500">
                      🕐 {activity.start_time}
                    </div>
                  )}
                </div>
                
                {activity.location && (
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    📍 {activity.location}
                  </div>
                )}
                
                {activity.estimated_cost && (
                  <div className="flex items-center text-xs text-gray-500">
                    💰 {activity.estimated_cost}
                  </div>
                )}
              </div>
            ))}
            
            {day.activities.length > 2 && (
              <div className="text-xs text-gray-500 text-center pt-2">
                +{day.activities.length - 2} actividades más
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DayCard