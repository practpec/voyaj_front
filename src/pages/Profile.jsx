import React, { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { authService } from '../services/api/authService'
import { subscriptionsService } from '../services/api/subscriptionsService'

const Profile = ({ user, subscription, onNavigate, onLogout, setUser }) => {
  const [activeTab, setActiveTab] = useState('profile')
  const [uploadLoading, setUploadLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [currentProfile, setCurrentProfile] = useState(user)
  const [currentSubscription, setCurrentSubscription] = useState(subscription)
  const fileInputRef = useRef(null)

  // Cargar datos frescos del perfil
  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    setProfileLoading(true)
    try {
      // Cargar perfil actualizado
      const profileData = await authService.getProfile()
      setCurrentProfile(profileData)
      
      // Actualizar usuario en el estado global
      setUser(profileData)
      localStorage.setItem('user', JSON.stringify(profileData))

      // Cargar suscripción actualizada
      try {
        const subData = await subscriptionsService.getSubscriptionStatus()
        setCurrentSubscription(subData)
      } catch (subError) {
        console.error('[PROFILE] Subscription load failed:', subError)
        setCurrentSubscription(null)
      }
    } catch (error) {
      console.error('[PROFILE] Profile load failed:', error)
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten archivos de imagen')
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB')
      return
    }

    setUploadLoading(true)
    try {
      const response = await authService.uploadProfilePhoto(file)
      
      // Actualizar usuario con nueva foto
      const updatedUser = { ...currentProfile, profile_photo_url: response.profile_photo_url }
      setCurrentProfile(updatedUser)
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      alert('Foto actualizada correctamente')
    } catch (error) {
      console.error('[PROFILE] Photo upload error:', error)
      alert('Error al subir la foto')
    } finally {
      setUploadLoading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const getPlanInfo = () => {
    if (!currentSubscription) return { text: '', color: 'text-gray-500', bg: 'bg-gray-100' }
    
    if (currentSubscription.is_pro) {
      return {
        text: 'Plan PRO',
        color: 'text-green-700',
        bg: 'bg-green-100'
      }
    } else {
      return {
        text: 'Plan FREE',
        color: 'text-blue-700',
        bg: 'bg-blue-100'
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const planInfo = getPlanInfo()

  // Mostrar loading si están cargando los datos
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} subscription={subscription} onNavigate={onNavigate} onLogout={onLogout} />
        <Sidebar currentRoute="profile" onNavigate={onNavigate} />
        
        <div className="lg:ml-20 pt-20">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando perfil...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={currentProfile} subscription={currentSubscription} onNavigate={onNavigate} onLogout={onLogout} />
      <Sidebar currentRoute="profile" onNavigate={onNavigate} />
      
      <div className="lg:ml-20 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Mi Perfil</h1>
            <p className="text-gray-600">Gestiona tu información personal</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
              {/* Avatar Section - Clickeable para cambiar foto */}
              <div className="relative cursor-pointer" onClick={triggerFileInput}>
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white font-bold text-3xl overflow-hidden hover:opacity-80 transition-opacity">
                  {currentProfile?.profile_photo_url ? (
                    <img 
                      src={currentProfile.profile_photo_url} 
                      alt="Foto de perfil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (currentProfile?.name?.charAt(0) || currentProfile?.email?.charAt(0) || 'U').toUpperCase()
                  )}
                </div>
                
                {/* Overlay con ícono de cámara */}
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  {uploadLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {/* User Info */}
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {currentProfile?.name || 'Usuario'}
                </h2>
                <p className="text-gray-600 mb-3">{currentProfile?.email}</p>
                
                {/* Plan Badge - Solo mostrar si hay subscription */}
                {currentSubscription && planInfo.text && (
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${planInfo.bg} ${planInfo.color} mb-3`}>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    {planInfo.text}
                  </div>
                )}
                
                <p className="text-sm text-gray-500">
                  Miembro desde {formatDate(currentProfile?.created_at)}
                </p>
                
                {currentSubscription?.is_pro && currentSubscription?.expires_at && (
                  <p className="text-sm text-gray-500 mt-1">
                    Plan PRO hasta {formatDate(currentSubscription.expires_at)}
                  </p>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'profile'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Información Personal
              </button>
              <button
                onClick={() => setActiveTab('subscription')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'subscription'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Suscripción
              </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Información no editable */}
                <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-400">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-blue-800 mb-1">Información del Perfil</h3>
                      <p className="text-sm text-blue-700">
                        Los datos del perfil se obtienen automáticamente. Haz clic en tu foto para cambiarla.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      value={currentProfile?.name || ''}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700"
                      disabled
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={currentProfile?.email || ''}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700"
                      disabled
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Plan de Suscripción
                  </h3>
                  
                  {currentSubscription ? (
                    <div className="space-y-4">
                      {currentSubscription && planInfo.text && (
                        <div className={`inline-flex items-center px-6 py-3 rounded-xl text-lg font-medium ${planInfo.bg} ${planInfo.color}`}>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          {planInfo.text}
                        </div>
                      )}
                      
                      {currentSubscription.is_pro ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                          <h4 className="font-medium text-green-800 mb-2">
                            ¡Disfruta de tu Plan PRO!
                          </h4>
                          <p className="text-green-700 text-sm mb-4">
                            Tienes acceso a todas las funcionalidades premium
                          </p>
                          
                          {currentSubscription.expires_at && (
                            <p className="text-green-600 text-sm">
                              Válido hasta: {formatDate(currentSubscription.expires_at)}
                            </p>
                          )}
                          
                          <button
                            onClick={() => onNavigate('subscription')}
                            className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Gestionar Suscripción
                          </button>
                        </div>
                      ) : (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                          <h4 className="font-medium text-blue-800 mb-2">
                            Plan FREE
                          </h4>
                          <p className="text-blue-700 text-sm mb-4">
                            Actualiza a PRO para desbloquear todas las funcionalidades
                          </p>
                          
                          <div className="text-left text-sm text-blue-600 mb-4">
                            <p className="font-medium mb-2">Con PRO obtienes:</p>
                            <ul className="space-y-1">
                              <li>✈️ Viajes ilimitados</li>
                              <li>📸 Fotos ilimitadas</li>
                              <li>📊 Análisis avanzados</li>
                              <li>📄 Exportar a PDF</li>
                            </ul>
                          </div>
                          
                          <button
                            onClick={() => onNavigate('subscription')}
                            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors"
                          >
                            Actualizar a PRO
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p>Cargando información de suscripción...</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile