import { useState } from 'react'
import { authService } from '../services/api/authService.js'
import { storage } from '../utils/storage.js'
import { validateRegisterForm } from '../utils/validators/authValidators.js'

function Register({ onNavigate, setUser }) {
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateRegisterForm(form)
    if (validationErrors) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const response = await authService.register(form)
      storage.setAuthTokens(response)
      storage.setUser(response.user)
      setUser(response.user)
      onNavigate('verify-email')
    } catch (error) {
      setErrors({ general: error.toString() })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1>Crear Cuenta</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ width: '100%', padding: '10px' }}
          />
          {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ width: '100%', padding: '10px' }}
          />
          {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ width: '100%', padding: '10px' }}
          />
          {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
        </div>

        {errors.general && <div style={{ color: 'red', marginBottom: '15px' }}>{errors.general}</div>}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
          {loading ? 'Cargando...' : 'Crear Cuenta'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={() => onNavigate('login')} style={{ background: 'none', border: 'none', color: 'blue' }}>
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>
    </div>
  )
}

export default Register