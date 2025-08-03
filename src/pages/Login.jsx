import { useState } from 'react'
import { authService } from '../services/api/authService.js'
import { storage } from '../utils/storage.js'
import { validateLoginForm } from '../utils/validators/authValidators.js'

function Login({ onNavigate, setUser }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateLoginForm(form)
    if (validationErrors) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const response = await authService.login(form)
      
      console.log('[LOGIN] Full response:', response)
      console.log('[LOGIN] Token type:', typeof response.access_token)
      console.log('[LOGIN] Token value:', response.access_token)
      
      // Verificar que el token se guarde correctamente
      const success = storage.setAuthTokens(response)
      console.log('[LOGIN] Token storage success:', success)
      
      // Verificar inmediatamente que se guardó
      const savedToken = storage.getAuthToken()
      console.log('[LOGIN] Saved token check:', savedToken)
      
      storage.setUser(response.user)
      setUser(response.user)
      onNavigate('dashboard')
    } catch (error) {
      setErrors({ general: error.toString() })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1>Iniciar Sesión</h1>
      
      <form onSubmit={handleSubmit}>
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
          {loading ? 'Cargando...' : 'Ingresar'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={() => onNavigate('register')} style={{ background: 'none', border: 'none', color: 'blue' }}>
          ¿No tienes cuenta? Regístrate
        </button>
        <br />
        <button onClick={() => onNavigate('reset-password')} style={{ background: 'none', border: 'none', color: 'blue' }}>
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </div>
  )
}

export default Login