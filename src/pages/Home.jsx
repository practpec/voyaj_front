import { useState } from 'react'

function Home({ onNavigate }) {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const handleShowLogin = () => {
    onNavigate('login')
  }

  const handleShowRegister = () => {
    onNavigate('register')
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo - Igual que Dashboard */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h1 className="text-lg font-semibold text-primary">Voyaj</h1>
            </div>
            
            {/* Auth buttons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleShowLogin}
                className="text-gray-700 hover:text-primary font-medium transition-colors duration-200"
              >
                Iniciar sesión
              </button>
              <button 
                onClick={handleShowRegister}
                className="bg-primary text-white font-semibold py-2 px-6 rounded-full hover:bg-primary-hover hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 md:py-20 lg:py-28 bg-gradient-to-br from-vanilla-50 via-white to-sage-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center space-y-8 md:space-y-12">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight px-4 md:px-0">
                Planifica, disfruta y recuerda
                <br />
                <span className="text-primary">cada aventura</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4 md:px-0">
                La plataforma todo-en-uno para viajeros inteligentes.
                Organiza itinerarios, controla gastos y guarda recuerdos únicos.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <button 
                onClick={handleShowRegister}
                className="bg-primary text-white font-semibold py-4 px-8 rounded-full hover:bg-primary-hover hover:-translate-y-1 transform transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
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
                  icon: "🌐",
                  title: "Funciona offline",
                  description: "Accede a tus planes sin internet. Sincroniza automáticamente cuando tengas conexión.",
                  color: "primary"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="space-y-10 md:space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Elige el plan perfecto para tu estilo de viaje
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
                  <div className="flex justify-center">
                    <button 
                      onClick={handleShowRegister}
                      className="bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Comenzar Gratis
                    </button>
                  </div>

                  <hr className="border-gray-200" />

                  {/* Features */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700">
                      ✅ Incluye:
                    </p>
                    <ul className="space-y-2">
                      {[
                        "1 viaje activo",
                        "Planificación básica",
                        "Control de gastos",
                        "Hasta 50 fotos",
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
                  </div>
                </div>
              </div>

              {/* Plan PRO */}
              <div className="bg-primary relative shadow-xl border-2 border-primary rounded-xl overflow-hidden">
                {/* Popular badge */}
                <div className="absolute top-0 right-0 bg-sage-600 text-white px-3 py-1 text-xs font-semibold">
                  MÁS POPULAR
                </div>

                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🚀</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Aventurero PRO</h3>
                        <p className="text-sm text-sage-100">Para viajeros frecuentes</p>
                      </div>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-white">$24.99</span>
                      <span className="text-sage-100">/ mes</span>
                    </div>
                  </div>

                  {/* Button */}
                  <div className="flex justify-center">
                    <button 
                      onClick={handleShowRegister}
                      className="bg-white text-primary font-semibold py-3 px-6 rounded-lg hover:bg-vanilla-100 hover:-translate-y-0.5 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
                    >
                      <span>Empezar ahora gratis</span>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-sm text-sage-200 text-center px-4">
                    No necesitas tarjeta de crédito • Configuración en 2 minutos
                  </p>

                  <hr className="border-sage-400 border-opacity-30" />

                  {/* Features */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-white">
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
                        "Exportación PDF",
                        "Soporte prioritario 24/7"
                      ].map((feature, idx) => (
                        <li key={idx} className="text-sm text-sage-100 flex items-center space-x-2">
                          <svg className="w-4 h-4 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <div className="space-y-4">
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 italic">"{testimonial.text}"</p>
                    <div>
                      <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
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
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
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