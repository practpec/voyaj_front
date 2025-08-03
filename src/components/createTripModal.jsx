import { useState } from 'react'
import { tripsService } from '../services/api/tripsService.js'
import { validateCreateTripForm } from '../utils/validators/tripsValidators'

function CreateTripModal({ onClose, onTripCreated }) {
  const [form, setForm] = useState({
    title: '',
    start_date: '',
    end_date: '',
    base_currency: 'MXN',
    estimated_total_budget: '',
    is_public: false
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateCreateTripForm(form)
    if (validationErrors) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const tripData = {
        ...form,
        estimated_total_budget: form.estimated_total_budget ? parseFloat(form.estimated_total_budget) : null
      }
      await tripsService.createTrip(tripData)
      onTripCreated()
    } catch (error) {
      if (error.includes('PRO subscription required')) {
        setErrors({ general: 'Plan FREE permite solo 1 viaje. Actualiza a PRO para viajes ilimitados.' })
      } else {
        setErrors({ general: error.toString() })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        width: '500px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h2>Crear Nuevo Viaje</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Título del viaje"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={{ width: '100%', padding: '10px' }}
            />
            {errors.title && <div style={{ color: 'red' }}>{errors.title}</div>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Fecha de inicio:</label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              style={{ width: '100%', padding: '10px' }}
            />
            {errors.start_date && <div style={{ color: 'red' }}>{errors.start_date}</div>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Fecha de fin:</label>
            <input
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              style={{ width: '100%', padding: '10px' }}
            />
            {errors.end_date && <div style={{ color: 'red' }}>{errors.end_date}</div>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <select
              value={form.base_currency}
              onChange={(e) => setForm({ ...form, base_currency: e.target.value })}
              style={{ width: '100%', padding: '10px' }}
            >
              <option value="MXN">MXN - Peso Mexicano</option>
              <option value="USD">USD - Dólar</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <input
              type="number"
              step="0.01"
              placeholder="Presupuesto estimado (opcional)"
              value={form.estimated_total_budget}
              onChange={(e) => setForm({ ...form, estimated_total_budget: e.target.value })}
              style={{ width: '100%', padding: '10px' }}
            />
            {errors.estimated_total_budget && <div style={{ color: 'red' }}>{errors.estimated_total_budget}</div>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>
              <input
                type="checkbox"
                checked={form.is_public}
                onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
              />
              Viaje público
            </label>
          </div>

          {errors.general && <div style={{ color: 'red', marginBottom: '15px' }}>{errors.general}</div>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '10px' }}>
              {loading ? 'Creando...' : 'Crear Viaje'}
            </button>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px' }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTripModal