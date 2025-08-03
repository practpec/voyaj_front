import { useState } from 'react'
import { authService } from '../services/api/authService.js'
import { storage } from '../utils/storage.js'
import { validateRegisterForm } from '../utils/validators/authValidators.js'

function Register({ onNavigate, setUser }) {
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!acceptTerms) {
      setErrors({ acceptTerms: 'Debes aceptar los términos y condiciones' })
      return
    }
    
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

  const handleBackToHome = () => {
    onNavigate('home')
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
              onClick={handleBackToHome}
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
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-text-default">
                Únete a la aventura
              </h1>
              <p className="text-lg text-text-muted">
                Crea tu cuenta y empieza a planificar viajes increíbles
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo Nombre */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-default mb-2">
                  Nombre completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    placeholder="Tu nombre completo"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full h-12 px-4 pr-12 bg-white border rounded-xl transition-all duration-200 
                      ${errors.name 
                        ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100' 
                        : 'border-border-default hover:border-gray-300 focus:border-primary focus:ring-4 focus:ring-focus-ring/20'
                      } focus:outline-none`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Campo Email */}
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
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
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

              {/* Campo Contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-default mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Crea una contraseña segura"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`w-full h-12 px-4 pr-12 bg-white border rounded-xl transition-all duration-200 
                      ${errors.password 
                        ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100' 
                        : 'border-border-default hover:border-gray-300 focus:border-primary focus:ring-4 focus:ring-focus-ring/20'
                      } focus:outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
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
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Checkbox de términos */}
              <div>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => {
                        setAcceptTerms(e.target.checked)
                        if (errors.acceptTerms) {
                          setErrors(prev => ({ ...prev, acceptTerms: '' }))
                        }
                      }}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center
                      ${acceptTerms 
                        ? 'bg-primary border-primary' 
                        : 'border-border-default hover:border-gray-300'
                      }`}
                    >
                      {acceptTerms && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-text-muted">
                    Acepto los{' '}
                    <button 
                      type="button"
                      className="text-primary hover:text-primary-hover font-medium underline"
                    >
                      términos y condiciones
                    </button>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="text-red-400 text-xs mt-1">{errors.acceptTerms}</p>
                )}
              </div>

              {/* Error general */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {errors.general}
                </div>
              )}

              {/* Botón de submit */}
              <button
                type="submit"
                disabled={loading || !acceptTerms}
                className={`w-full h-12 rounded-full font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2
                  ${loading || !acceptTerms
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-primary hover:bg-primary-hover hover:-translate-y-0.5 transform shadow-card hover:shadow-elevated'
                  }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creando cuenta...</span>
                  </>
                ) : (
                  <>
                    <span>Crear cuenta</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Enlaces adicionales */}
            <div className="text-center">
              <p className="text-sm text-text-muted">
                ¿Ya tienes cuenta?{' '}
                <button 
                  onClick={() => onNavigate('login')}
                  className="text-primary hover:text-primary-hover font-medium transition-colors duration-200"
                >
                  Inicia sesión
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register