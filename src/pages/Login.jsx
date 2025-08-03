import { useState } from 'react'
import { authService } from '../services/api/authService.js'
import { storage } from '../utils/storage.js'
import { validateLoginForm } from '../utils/validators/authValidators.js'

function Login({ onNavigate, setUser }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
                Inicia sesión
              </h1>
              <p className="text-lg text-text-muted">
                Continúa tu aventura donde la dejaste
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    placeholder="Tu contraseña"
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

              {/* Error general */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {errors.general}
                </div>
              )}

              {/* Botón de submit */}
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
                    <span>Ingresando...</span>
                  </div>
                ) : (
                  'Ingresar'
                )}
              </button>
            </form>

            {/* Enlaces adicionales */}
            <div className="space-y-4 text-center">
              <button 
                onClick={() => onNavigate('register')}
                className="text-primary hover:text-primary-hover font-medium transition-colors duration-200"
              >
                ¿No tienes cuenta? Regístrate
              </button>
              
              <br />
              
              <button 
                onClick={() => onNavigate('reset-password')}
                className="text-text-muted hover:text-primary font-medium transition-colors duration-200"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login