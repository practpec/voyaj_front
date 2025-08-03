import { useState } from 'react'
import { authService } from '../services/api/authService.js'

function ForgotPassword({ onNavigate }) {
  const [step, setStep] = useState('email') // 'email' | 'reset'
  const [form, setForm] = useState({
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSendResetEmail = async (e) => {
    e.preventDefault()
    
    if (!form.email) {
      setErrors({ email: 'El email es obligatorio' })
      return
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) {
      setErrors({ email: 'Email inválido' })
      return
    }

    setLoading(true)
    setErrors({})

    try {
      await authService.sendPasswordReset(form.email)
      setStep('reset')
    } catch (error) {
      setErrors({ general: error.toString() })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    
    const newErrors = {}
    
    if (!form.token) {
      newErrors.token = 'El código es obligatorio'
    } else if (!/^\d{6}$/.test(form.token)) {
      newErrors.token = 'El código debe tener 6 dígitos'
    }
    
    if (!form.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es obligatoria'
    } else if (form.newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu nueva contraseña'
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      await authService.resetPassword({
        email: form.email,
        token: form.token,
        new_password: form.newPassword
      })
      onNavigate('login')
    } catch (error) {
      let errorMessage = 'Error al cambiar contraseña'
      if (error.message === 'Invalid reset token') {
        errorMessage = 'Código de recuperación inválido'
      } else if (error.message === 'Reset token expired') {
        errorMessage = 'El código ha expirado. Solicita uno nuevo'
      }
      setErrors({ general: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    onNavigate('login')
  }

  const handleStartOver = () => {
    setStep('email')
    setForm({
      email: '',
      token: '',
      newPassword: '',
      confirmPassword: ''
    })
    setErrors({})
  }

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
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

          {/* Contenido del paso actual */}
          {step === 'email' ? (
            /* Paso 1: Solicitar email */
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold text-text-default">
                  ¿Olvidaste tu contraseña?
                </h1>
                <p className="text-lg text-text-muted">
                  Ingresa tu email y te enviaremos un código para recuperarla
                </p>
              </div>

              <form onSubmit={handleSendResetEmail} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-default mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      placeholder="tu@email.com"
                      value={form.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full h-12 px-4 pr-12 bg-white border rounded-xl transition-all duration-200 
                        ${errors.email 
                          ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100' 
                          : 'border-border-default hover:border-gray-300 focus:border-primary focus:ring-4 focus:ring-focus-ring/20'
                        } focus:outline-none`}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {errors.general}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-12 rounded-full font-semibold text-white transition-all duration-300 
                    ${loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary-hover hover:-translate-y-0.5 transform shadow-card hover:shadow-elevated'
                    }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando código...</span>
                    </div>
                  ) : (
                    'Enviar código de recuperación'
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Paso 2: Ingresar código y nueva contraseña */
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold text-text-default">
                  Restablecer contraseña
                </h1>
                <p className="text-lg text-text-muted">
                  Revisa tu email e ingresa el código que te enviamos
                </p>
              </div>

              {/* Alert con información */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">Código enviado a {form.email}</p>
                    <p className="mt-1">Si no lo ves, revisa tu carpeta de spam.</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* Campo código */}
                <div>
                  <label htmlFor="token" className="block text-sm font-medium text-text-default mb-2">
                    Código de recuperación
                  </label>
                  <input
                    type="text"
                    id="token"
                    placeholder="123456"
                    value={form.token}
                    onChange={(e) => handleInputChange('token', e.target.value)}
                    maxLength={6}
                    className={`w-full h-12 px-4 bg-white border rounded-xl text-center text-lg font-semibold tracking-widest transition-all duration-200 
                      ${errors.token 
                        ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100' 
                        : 'border-border-default hover:border-gray-300 focus:border-primary focus:ring-4 focus:ring-focus-ring/20'
                      } focus:outline-none`}
                  />
                  {errors.token && (
                    <p className="text-red-400 text-xs mt-1">{errors.token}</p>
                  )}
                </div>

                {/* Nueva contraseña */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-text-default mb-2">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      placeholder="••••••••"
                      value={form.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      className={`w-full h-12 px-4 pr-12 bg-white border rounded-xl transition-all duration-200 
                        ${errors.newPassword 
                          ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100' 
                          : 'border-border-default hover:border-gray-300 focus:border-primary focus:ring-4 focus:ring-focus-ring/20'
                        } focus:outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showNewPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-400 text-xs mt-1">{errors.newPassword}</p>
                  )}
                </div>

                {/* Confirmar contraseña */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-default mb-2">
                    Confirmar nueva contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full h-12 px-4 pr-12 bg-white border rounded-xl transition-all duration-200 
                        ${errors.confirmPassword 
                          ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100' 
                          : 'border-border-default hover:border-gray-300 focus:border-primary focus:ring-4 focus:ring-focus-ring/20'
                        } focus:outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {errors.general}
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-12 rounded-full font-semibold text-white transition-all duration-300 
                      ${loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-primary hover:bg-primary-hover hover:-translate-y-0.5 transform shadow-card hover:shadow-elevated'
                      }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Cambiando contraseña...</span>
                      </div>
                    ) : (
                      'Cambiar contraseña'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleStartOver}
                    className="w-full text-text-muted hover:text-primary transition-colors duration-200 text-sm"
                  >
                    ¿No recibiste el código? Intentar de nuevo
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword