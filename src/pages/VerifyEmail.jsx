import { useState } from 'react'
import { authService } from '../services/api/authService.js'

function VerifyEmail({ onNavigate }) {
  const [form, setForm] = useState({ email: '', token: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await authService.verifyEmail(form)
      setMessage('Email verificado correctamente')
      setTimeout(() => onNavigate('login'), 2000)
    } catch (error) {
      setMessage(error.toString())
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!form.email) {
      setMessage('Ingresa tu email primero')
      return
    }

    setLoading(true)
    try {
      await authService.sendVerificationEmail()
      setMessage('Código reenviado')
    } catch (error) {
      setMessage(error.toString())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1>Verificar Email</h1>
      <p>Revisa tu email y ingresa el código de verificación</p>

      <form onSubmit={handleVerify}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Código de verificación"
            value={form.token}
            onChange={(e) => setForm({ ...form, token: e.target.value })}
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
          {loading ? 'Verificando...' : 'Verificar'}
        </button>

        <button type="button" onClick={handleResend} disabled={loading} style={{ width: '100%', padding: '10px' }}>
          Reenviar Código
        </button>
      </form>

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

export default VerifyEmail