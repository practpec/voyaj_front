function AnalyticsCards({ analytics, trip }) {
  if (!analytics) return null

  const cards = [
    {
      title: 'Resumen del Viaje',
      icon: '📊',
      stats: [
        { label: 'Total días', value: analytics.trip_summary.total_days },
        { label: 'Días con actividades', value: analytics.trip_summary.days_with_activities },
        { label: 'Total actividades', value: analytics.trip_summary.total_activities },
        { label: 'Total miembros', value: analytics.trip_summary.total_members }
      ]
    },
    {
      title: 'Resumen de Gastos',
      icon: '💰',
      stats: [
        { label: 'Total gastado', value: `${trip.base_currency} ${analytics.expense_summary.total_expenses}` },
        { label: 'Número de gastos', value: analytics.expense_summary.total_expense_records },
        { label: 'Presupuesto estimado', value: `${trip.base_currency} ${analytics.expense_summary.budget_vs_actual.estimated_budget}` },
        { label: 'Varianza', value: `${trip.base_currency} ${analytics.expense_summary.budget_vs_actual.variance}` }
      ]
    },
    {
      title: 'Contenido',
      icon: '📷',
      stats: [
        { label: 'Total fotos', value: analytics.content_summary.total_photos },
        { label: 'Entradas de diario', value: analytics.content_summary.total_journal_entries }
      ]
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <span className="text-xl mr-2">{card.icon}</span>
            <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
          </div>
          <div className="space-y-3">
            {card.stats.map((stat, statIndex) => (
              <div key={statIndex} className="flex justify-between">
                <span className="text-gray-600">{stat.label}:</span>
                <span className="font-medium text-gray-900">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(analytics.expense_summary.expenses_by_category).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:col-span-2 lg:col-span-3">
          <div className="flex items-center mb-4">
            <span className="text-xl mr-2">📖</span>
            <h3 className="text-lg font-semibold text-gray-900">Gastos por Categoría</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(analytics.expense_summary.expenses_by_category).map(([category, amount]) => (
              <div key={category} className="text-center">
                <div className="text-sm text-gray-600 capitalize">{category}</div>
                <div className="font-semibold text-gray-900">{trip.base_currency} {amount}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalyticsCards