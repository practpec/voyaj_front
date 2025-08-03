import { useState, useEffect } from 'react'
import { authService } from '../services/api/authService.js'

function VerifyEmail({ onNavigate, user }) {
  const [form, setForm] = useState({ email: '', token: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [countdown, setCountdown] = useState(60)

  // Obtener email del usuario o del localStorage
  const userEmail = user?.email || localStorage.getItem('pendingVerificationEmail')

  useEffect(() => {
    // Si no hay email para verificar, redirigir al registro
    if (!userEmail) {
      onNavigate('register')
      return
    }

    // Establecer el email en el formulario
    setForm(prev => ({ ...prev, email: userEmail }))

    // Iniciar countdown para reenvío
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [userEmail, onNavigate])

  const handleVerify = async (e) => {
    e.preventDefault()
    
    if (!form.token || form.token.length !== 6) {
      setMessage('El código debe tener 6 dígitos')
      return
    }

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
    if (!canResend) return

    setIsResending(true)
    setMessage('')
    
    try {
      await authService.sendVerificationEmail()
      setMessage('Código reenviado a tu email')
      setCanResend(false)
      setCountdown(60)
    } catch (error) {
      setMessage(error.toString())
    } finally {
      setIsResending(false)
    }
  }

  const handleBackToLogin = () => {
    onNavigate('login')
  }

  const handleCodeInput = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setForm({ ...form, token: value })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && form.token.length === 6) {
      handleVerify(e)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-soft via-background to-accent font-sans relative">
      {/* Patrón de fondo sutil */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, #9CAF88 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="max-w-md mx-auto py-8 px-6 relative z-10">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleBackToLogin}
              className="p-2 text-text-muted hover:text-primary hover:bg-hover-bg rounded-full transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-text-default">Voyaj</h1>
            </div>
            
            <div className="w-10"></div>
          </div>

          {/* Título principal */}
          <div className="space-y-6">
            <div className="space-y-3 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-text-default">
                Verifica tu email
              </h1>
              <p className="text-lg text-text-muted">
                Hemos enviado un código de verificación de 6 dígitos a
              </p>
              <p className="text-lg font-semibold text-primary">
                {userEmail}
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleVerify} className="space-y-6">
              {/* Campo código de verificación */}
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-text-default mb-3 text-center">
                  Ingresa el código de verificación
                </label>
                <input
                  type="text"
                  id="token"
                  placeholder="000000"
                  value={form.token}
                  onChange={handleCodeInput}
                  onKeyPress={handleKeyPress}
                  maxLength={6}
                  className="w-full h-15 px-4 bg-gray-50 border-2 border-border-default text-2xl text-center tracking-widest font-semibold rounded-xl transition-all duration-200 hover:border-gray-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-focus-ring/20 focus:outline-none"
                />
              </div>

              {/* Mensaje de estado */}
              {message && (
                <div className={`px-4 py-3 rounded-xl text-sm text-center ${
                  message.includes('correctamente') || message.includes('reenviado')
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              {/* Botón verificar */}
              <button
                type="submit"
                disabled={loading || form.token.length !== 6}
                className={`w-full h-12 rounded-full font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2
                  ${loading || form.token.length !== 6
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-primary hover:bg-primary-hover hover:-translate-y-0.5 transform shadow-card hover:shadow-elevated'
                  }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <span>Verificar</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>

              {/* Botón reenviar */}
              <div className="text-center">
                <p className="text-xs text-text-muted mb-3">
                  ¿No recibiste el código?
                </p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend || isResending}
                  className={`text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1 mx-auto
                    ${canResend && !isResending
                      ? 'text-primary hover:text-primary-hover cursor-pointer'
                      : 'text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {isResending ? (
                    <>
                      <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Reenviando...</span>
                    </>
                  ) : canResend ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Reenviar código</span>
                    </>
                  ) : (
                    <span>Reenviar en {countdown}s</span>
                  )}
                </button>
              </div>
            </form>

            {/* Enlaces adicionales */}
            <div className="text-center">
              <p className="text-sm text-text-muted">
                ¿Problemas con la verificación?{' '}
                <button 
                  onClick={handleBackToLogin}
                  className="text-primary hover:text-primary-hover font-medium transition-colors duration-200"
                >
                  Volver al login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail