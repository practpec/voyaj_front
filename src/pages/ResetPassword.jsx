import { useState } from 'react'
import { authService } from '../services/api/authService.js'

function ResetPassword({ onNavigate }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ email: '', token: '', new_password: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await authService.sendPasswordReset(form.email)
      setMessage('Código enviado a tu email')
      setStep(2)
    } catch (error) {
      setMessage(error.toString())
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await authService.resetPassword(form)
      setMessage('Contraseña cambiada correctamente')
      setTimeout(() => onNavigate('login'), 2000)
    } catch (error) {
      setMessage(error.toString())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1>Restablecer Contraseña</h1>

      {step === 1 && (
        <form onSubmit={handleSendReset}>
          <p>Ingresa tu email para recibir el código</p>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', padding: '10px' }}
            />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
            {loading ? 'Enviando...' : 'Enviar Código'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleResetPassword}>
          <p>Ingresa el código y tu nueva contraseña</p>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Código de restablecimiento"
              value={form.token}
              onChange={(e) => setForm({ ...form, token: e.target.value })}
              style={{ width: '100%', padding: '10px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={form.new_password}
              onChange={(e) => setForm({ ...form, new_password: e.target.value })}
              style={{ width: '100%', padding: '10px' }}
            />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      )}

      {message && <div style={{ marginTop: '15px', color: message.includes('correctamente') ? 'green' : 'red' }}>
        {message}
      </div>}

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={() => onNavigate('login')} style={{ background: 'none', border: 'none', color: 'blue' }}>
          Volver al login
        </button>
      </div>
    </div>
  )
}

export default ResetPassword