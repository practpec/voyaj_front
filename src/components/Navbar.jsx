import React, { useState, useRef, useEffect } from 'react'

const Navbar = ({ user, subscription, onNavigate, onLogout, onMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getPlanText = () => {
    if (!subscription) return 'Cargando...'
    return subscription.is_pro ? 'Plan PRO' : 'Plan FREE'
  }

  const getPlanColor = () => {
    if (!subscription) return 'text-gray-500'
    return subscription.is_pro ? 'text-primary' : 'text-gray-500'
  }

  const handleProfile = () => {
    setIsDropdownOpen(false)
    onNavigate('profile')
  }

  const handleSettings = () => {
    setIsDropdownOpen(false)
    onNavigate('settings')
  }

  const handleLogout = () => {
    setIsDropdownOpen(false)
    onLogout()
  }

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto py-4 px-4 md:px-8">
        <div className="flex justify-between items-center">
          {/* Lado izquierdo: Menú hamburguesa + Logo */}
          <div className="flex items-center space-x-3">
            {/* Botón menú hamburguesa - Solo móvil */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h1 className="text-lg font-semibold text-primary">Voyaj</h1>
            </button>
          </div>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
            >
              {/* Info del usuario - Solo desktop */}
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-700">
                  {user?.name || "Usuario"}
                </p>
                <p className={`text-xs ${getPlanColor()}`}>
                  {getPlanText()}
                </p>
              </div>
              
              {/* Avatar */}
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </div>
              
              {/* Chevron */}
              <svg 
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                <button
                  onClick={handleProfile}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Mi Perfil</span>
                </button>
                
                <hr className="my-1 border-gray-200" />
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar