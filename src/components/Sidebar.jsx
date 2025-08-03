import React from 'react'

const Sidebar = ({ currentRoute, onNavigate, isOpen = false, onClose }) => {
  const navigationItems = [
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ), 
      label: 'Dashboard', 
      route: 'dashboard' 
    },
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ), 
      label: 'Mis Viajes', 
      route: 'my-trips' 
    },
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ), 
      label: 'Amigos', 
      route: 'friends' 
    },
  ]

  const secondaryItems = [
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ), 
      label: 'Mi Perfil', 
      route: 'profile' 
    }
  ]

  const handleNavigation = (route) => {
    onNavigate(route)
    if (onClose) {
      onClose()
    }
  }

  const isActive = (route) => currentRoute === route

  // Botón con tooltip para desktop
  const renderFloatingButton = (item) => (
    <div key={item.route} className="relative group">
      <button
        onClick={() => handleNavigation(item.route)}
        className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 border ${
          isActive(item.route)
            ? 'bg-primary text-white border-primary shadow-lg'
            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-md'
        } hover:shadow-xl hover:-translate-y-0.5`}
      >
        {item.icon}
      </button>
      
      {/* Tooltip */}
      <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
        {item.label}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
      </div>
    </div>
  )

  // Botón normal para móvil (drawer)
  const renderMobileButton = (item) => (
    <button
      key={item.route}
      onClick={() => handleNavigation(item.route)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive(item.route)
          ? 'bg-primary text-white font-semibold'
          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-800'
      }`}
    >
      <div className={`${isActive(item.route) ? 'text-white' : 'text-gray-600'}`}>
        {item.icon}
      </div>
      <span className="font-medium">{item.label}</span>
    </button>
  )

  // MOBILE: Drawer
  const MobileDrawer = () => (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={`fixed left-0 top-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-primary">Voyaj</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Navegación Principal */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Navegación
            </p>
            <div className="space-y-2">
              {navigationItems.map(renderMobileButton)}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Configuración */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Cuenta
            </p>
            <div className="space-y-2">
              {secondaryItems.map(renderMobileButton)}
            </div>
          </div>
        </div>
      </div>
    </>
  )

  // DESKTOP: Sidebar flotante con iconos
  const DesktopSidebar = () => (
    <div className="fixed left-6 top-32 z-10 hidden lg:block">
      <div className="space-y-4 p-4 bg-white rounded-2xl shadow-2xl border border-gray-100">
        {/* Navegación Principal */}
        {navigationItems.map(renderFloatingButton)}

        {/* Divider */}
        <div className="w-8 h-px bg-gray-200 mx-auto"></div>

        {/* Configuración */}
        {secondaryItems.map(renderFloatingButton)}
      </div>
    </div>
  )

  return (
    <>
      <MobileDrawer />
      <DesktopSidebar />
    </>
  )
}

export default Sidebar