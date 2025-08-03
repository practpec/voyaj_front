import React from 'react'

const Home = ({ onNavigate }) => {
  const handleShowRegister = () => {
    onNavigate('register')
  }

  const handleShowLogin = () => {
    onNavigate('login')
  }

  return (
    <div className="bg-white">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🧳</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Voyaj</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleShowLogin}
                className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium px-4 py-2"
              >
                Iniciar sesión
              </button>
              <button 
                onClick={handleShowRegister}
                className="bg-primary text-white font-semibold px-6 py-2 rounded-full hover:bg-primary-hover transform hover:-translate-y-0.5 transition-all duration-200 shadow-md"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sage-50 to-vanilla-100 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center space-y-6 md:space-y-8">
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-800 leading-tight max-w-5xl mx-auto px-2 md:px-0">
                Planifica, Vive y{' '}
                <span className="text-primary">Recuerda</span>
                <br />
                tus viajes perfectos
              </h1>
              <p className="text-md sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 md:px-0">
                La única app que necesitas para planificar tu viaje, controlar gastos durante el mismo,
                y conservar todos tus recuerdos organizados para siempre.
              </p>
            </div>
            <div className="space-y-4">
              <button 
                onClick={handleShowRegister}
                className="bg-primary text-white font-semibold py-4 px-8 rounded-full hover:bg-primary-hover hover:-translate-y-1 transform transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto max-w-xs flex items-center justify-center space-x-2"
              >
                <span>Comenzar mi primer viaje</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </button>
              <p className="text-sm text-gray-500 text-center px-4">
                ✨ Gratis durante tu primer viaje • Sin tarjeta de crédito
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="space-y-10 md:space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 px-4 md:px-0">
                Todo lo que necesitas para viajar mejor
              </h2>
              <p className="text-md md:text-lg text-gray-600 px-4 md:px-0">
                Herramientas inteligentes para cada etapa de tu aventura
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: "🗺️",
                  title: "Planificación inteligente",
                  description: "Crea itinerarios detallados con recomendaciones personalizadas y sincronización automática.",
                  color: "primary"
                },
                {
                  icon: "💰",
                  title: "Control de gastos",
                  description: "Rastrea cada peso gastado, convierte divisas al instante y mantén tu presupuesto bajo control.",
                  color: "primary"
                },
                {
                  icon: "📸",
                  title: "Diario visual",
                  description: "Guarda fotos, videos y notas organizados por día y ubicación para revivir cada momento.",
                  color: "primary"
                },
                {
                  icon: "👥",
                  title: "Viajes en grupo",
                  description: "Planifica con amigos, divide gastos automáticamente y mantén a todos sincronizados.",
                  color: "primary"
                },
                {
                  icon: "📊",
                  title: "Análisis avanzados",
                  description: "Descubre patrones en tus viajes y optimiza tu presupuesto con insights inteligentes.",
                  color: "primary"
                },
                {
                  icon: "🔄",
                  title: "Modo offline",
                  description: "Accede a tu información importante incluso sin conexión a internet durante el viaje.",
                  color: "primary"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="space-y-4 h-full flex flex-col">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center p-2">
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    <div className="space-y-2 flex-1">
                      <h3 className="text-sm md:text-md font-semibold text-gray-800 leading-tight">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-md">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { number: '15K+', label: 'Viajeros activos' },
              { number: '50+', label: 'Países cubiertos' },
              { number: '98%', label: 'Satisfacción' },
              { number: '24/7', label: 'Soporte' }
            ].map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {stat.number}
                </h3>
                <p className="text-sage-100 text-sm md:text-lg text-center px-2 md:px-0">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Solo Free y Pro */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="space-y-12 md:space-y-16">
            {/* Header */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center px-3 py-1 bg-primary bg-opacity-10 text-primary text-sm font-semibold rounded-full">
                Precios transparentes
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 px-4 md:px-0">
                Elige el plan perfecto para tu estilo de viaje
              </h2>
              <p className="text-md md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 md:px-0">
                Comienza gratis y evoluciona según tus necesidades.
                Sin contratos, sin sorpresas. Cancela cuando quieras.
              </p>
            </div>

            {/* Pricing Cards - Solo 2 planes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
              {/* Plan Free */}
              <div className="bg-white relative shadow-lg border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🗺️</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Explorador</h3>
                        <p className="text-sm text-gray-600">Perfecto para empezar</p>
                      </div>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-gray-800">Gratis</span>
                      <span className="text-gray-600">siempre</span>
                    </div>
                  </div>

                  {/* Button */}
                  <button 
                    onClick={handleShowRegister}
                    className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Comenzar Gratis
                  </button>

                  <hr className="border-gray-200" />

                  {/* Features */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700">
                      ✅ Todo incluido:
                    </p>
                    <ul className="space-y-2">
                      {[
                        "1 viaje activo",
                        "Planificación básica",
                        "Control de gastos",
                        "100 fotos por viaje",
                        "Diario personal",
                        "Soporte por email"
                      ].map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center space-x-2">
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4">
                      <p className="text-sm font-semibold text-gray-500">
                        ⚠️ Limitaciones:
                      </p>
                      <ul className="space-y-1 mt-2">
                        {[
                          "Sin viajes colaborativos",
                          "Sin exportación premium",
                          "Sin análisis avanzados"
                        ].map((limitation, idx) => (
                          <li key={idx} className="text-sm text-gray-500">
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan Pro */}
              <div className="bg-white relative transform scale-105 shadow-2xl border-2 border-primary rounded-xl overflow-hidden">
                {/* Popular badge */}
                <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-semibold">
                  Más Popular
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                        <span className="text-xl">⭐</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Aventurero</h3>
                        <p className="text-sm text-gray-600">Para viajeros frecuentes</p>
                      </div>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-gray-800">$9.99</span>
                      <span className="text-gray-600">mes</span>
                    </div>
                  </div>

                  {/* Button */}
                  <button 
                    onClick={handleShowRegister}
                    className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-hover hover:-translate-y-0.5 transition-all duration-200 shadow-md"
                  >
                    Elegir Plan
                  </button>

                  <hr className="border-gray-200" />

                  {/* Features */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700">
                      ✅ Todo incluido:
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Viajes ilimitados",
                        "Planificación avanzada",
                        "Control de gastos completo",
                        "Fotos ilimitadas",
                        "Diario colaborativo",
                        "Viajes en grupo (hasta 10 personas)",
                        "Análisis de patrones de gasto",
                        "Exportación PDF/Excel",
                        "Modo offline",
                        "Soporte prioritario 24/7"
                      ].map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center space-x-2">
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid - Por qué elegir Voyaj */}
            <div className="pt-8 md:pt-16">
              <div className="space-y-8">
                <h2 className="text-lg font-bold text-gray-800 text-center">
                  ¿Por qué elegir Voyaj?
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: "🛡️", title: "Datos seguros", desc: "Cifrado de extremo a extremo" },
                    { icon: "📱", title: "Apps nativas", desc: "iOS, Android y Web optimizadas" },
                    { icon: "🌍", title: "Funciona offline", desc: "Sin internet, sin problemas" },
                    { icon: "💬", title: "Soporte 24/7", desc: "Estamos aquí para ayudarte" }
                  ].map((item, index) => (
                    <div key={index} className="text-center space-y-3 p-4">
                      <div className="text-3xl">{item.icon}</div>
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 bg-vanilla-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="space-y-10 md:space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 px-4 md:px-0">
                Amado por viajeros de todo el mundo
              </h2>
              <p className="text-md md:text-lg text-gray-600 px-4 md:px-0">
                Descubre por qué miles de personas eligen Voyaj para sus aventuras
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  name: 'María González',
                  location: 'Madrid, España',
                  text: 'Voyaj transformó completamente mi forma de viajar. Ahora tengo todos mis recuerdos organizados y nunca me excedo del presupuesto.',
                  rating: 5
                },
                {
                  name: 'Carlos Rivera',
                  location: 'México DF, México',
                  text: 'La función de viajes en grupo es increíble. Pudimos planificar nuestro viaje a Japón entre 6 amigos sin complicaciones.',
                  rating: 5
                },
                {
                  name: 'Ana Martín',
                  location: 'Buenos Aires, Argentina',
                  text: 'Me encanta cómo compara lo planeado vs lo real. He mejorado mucho mis habilidades de planificación de viajes.',
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl p-4 md:p-6 h-full shadow-sm">
                  <div className="space-y-4 h-full flex flex-col">
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-red-400 fill-current" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-700 italic leading-relaxed text-sm md:text-md flex-1">
                      "{testimonial.text}"
                    </p>
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-800 text-sm md:text-md">
                        {testimonial.name}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center space-y-6 md:space-y-8">
            <div className="space-y-4 max-w-3xl mx-auto">
              <h2 className="text-lg md:text-xl font-bold text-white px-4 md:px-0">
                ¿Listo para tu próxima aventura?
              </h2>
              <p className="text-md md:text-lg text-sage-100 max-w-2xl mx-auto leading-relaxed px-4 md:px-0">
                Únete a miles de viajeros que ya están creando recuerdos increíbles con Voyaj.
                Tu primer viaje es completamente gratis.
              </p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleShowRegister}
                className="bg-white text-primary font-semibold py-4 px-8 rounded-full hover:bg-vanilla-100 hover:-translate-y-0.5 transition-all duration-300 shadow-lg w-full sm:w-auto max-w-xs flex items-center justify-center space-x-2"
              >
                <span>Empezar ahora gratis</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <p className="text-sm text-sage-200 text-center px-4">
                No necesitas tarjeta de crédito • Configuración en 2 minutos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🧳</span>
              </div>
              <h3 className="text-lg font-semibold text-white">Voyaj</h3>
            </div>
            <p className="text-gray-400 text-center">
              © 2024 Voyaj. Hecho con ❤️ para viajeros apasionados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home