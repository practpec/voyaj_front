import { useState } from 'react'

function DayDetailModal({ day, isOpen, onClose, onCreateExpense, onCreateJournal, expenseForm, setExpenseForm, journalForm, setJournalForm, dayExpenses, dayJournalEntries, onDeleteExpense }) {
  const [activeTab, setActiveTab] = useState('activities')
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showJournalForm, setShowJournalForm] = useState(false)

  if (!isOpen || !day) return null

  const formattedDate = new Date(day.date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const handleExpenseSubmit = (e) => {
    e.preventDefault()
    onCreateExpense(e)
    setShowExpenseForm(false)
  }

  const handleJournalSubmit = (e) => {
    e.preventDefault()
    onCreateJournal(e)
    setShowJournalForm(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 capitalize">{formattedDate}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          {['activities', 'expenses', 'journal'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'activities' && 'Actividades'}
              {tab === 'expenses' && 'Gastos'}
              {tab === 'journal' && 'Diario'}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div>
              {day.notes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-blue-900 mb-2">Notas del día</h3>
                  <p className="text-blue-800">{day.notes}</p>
                </div>
              )}

              {day.activities.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📅</div>
                  <p className="text-gray-500">No hay actividades programadas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {day.activities.map(activity => (
                    <div key={activity.id} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{activity.title}</h3>
                      {activity.description && (
                        <p className="text-gray-600 mb-3">{activity.description}</p>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        {activity.location && (
                          <div className="flex items-center text-gray-500">
                            📍 {activity.location}
                          </div>
                        )}
                        {activity.start_time && (
                          <div className="flex items-center text-gray-500">
                            🕐 {activity.start_time}
                          </div>
                        )}
                        {activity.estimated_cost && (
                          <div className="flex items-center text-gray-500">
                            💰 {activity.estimated_cost}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Expenses Tab */}
          {activeTab === 'expenses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Gastos del día ({dayExpenses.length})</h3>
                <button
                  onClick={() => setShowExpenseForm(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  ➕ Agregar Gasto
                </button>
              </div>

              {showExpenseForm && (
                <form onSubmit={handleExpenseSubmit} className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Monto"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                      required
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Descripción"
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                      required
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                      required
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="transporte">Transporte</option>
                      <option value="alojamiento">Alojamiento</option>
                      <option value="comida">Comida</option>
                      <option value="actividades">Actividades</option>
                      <option value="compras">Compras</option>
                      <option value="otros">Otros</option>
                    </select>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowExpenseForm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {dayExpenses.map(expense => (
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{expense.description}</h4>
                      <p className="text-sm text-gray-600">{expense.currency} {expense.amount} - {expense.category}</p>
                      <p className="text-xs text-gray-500">{expense.date}</p>
                    </div>
                    <button
                      onClick={() => onDeleteExpense(expense.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Journal Tab */}
          {activeTab === 'journal' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Entradas de diario ({dayJournalEntries.length})</h3>
                <button
                  onClick={() => setShowJournalForm(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  ➕ Nueva Entrada
                </button>
              </div>

              {showJournalForm && (
                <form onSubmit={handleJournalSubmit} className="bg-gray-50 rounded-lg p-4 mb-6">
                  <textarea
                    placeholder="Escribe sobre tu día..."
                    value={journalForm.content}
                    onChange={(e) => setJournalForm({ ...journalForm, content: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowJournalForm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {dayJournalEntries.map(entry => (
                  <div key={entry.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <span className="text-lg mr-2">📖</span>
                      <span className="text-sm text-gray-500">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap">{entry.content}</p>
                    {entry.recommendations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Recomendaciones:</h5>
                        {entry.recommendations.map((rec, index) => (
                          <p key={index} className="text-sm text-gray-600">
                            {rec.type}: {rec.note}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DayDetailModal