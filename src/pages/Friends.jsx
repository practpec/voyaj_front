import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { friendshipsService } from '../services/api/friendshipsService'
import { authService } from '../services/api/authService'

const Friends = ({ user, onNavigate, onLogout }) => {
  const [friends, setFriends] = useState([])
  const [friendRequests, setFriendRequests] = useState({ received: [], sent: [] })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [activeTab, setActiveTab] = useState('friends') // 'friends', 'requests', 'search'
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    loadFriendsData()
  }, [])

  const loadFriendsData = async () => {
    try {
      const [friendsData, requestsData] = await Promise.all([
        friendshipsService.getFriends(),
        friendshipsService.getFriendRequests()
      ])
      
      setFriends(friendsData)
      setFriendRequests(requestsData)
    } catch (error) {
      console.error('[FRIENDS] Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setSearchLoading(true)
    try {
      const results = await authService.searchUsers(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error('[FRIENDS] Search error:', error)
    } finally {
      setSearchLoading(false)
    }
  }

  const sendFriendRequest = async (recipientId) => {
    try {
      await friendshipsService.sendFriendRequest({ 
        recipient_id: recipientId,
        message: 'Hola! Me gustaría conectar contigo en Voyaj'
      })
      alert('Solicitud enviada correctamente')
      loadFriendsData()
    } catch (error) {
      console.error('[FRIENDS] Send request error:', error)
      alert('Error al enviar solicitud')
    }
  }

  const respondToRequest = async (requestId, accept) => {
    try {
      await friendshipsService.respondToRequest(requestId, { accept })
      alert(accept ? 'Solicitud aceptada' : 'Solicitud rechazada')
      loadFriendsData()
    } catch (error) {
      console.error('[FRIENDS] Respond error:', error)
      alert('Error al responder solicitud')
    }
  }

  const removeFriend = async (friendId) => {
    if (!confirm('¿Estás seguro de eliminar este amigo?')) return
    
    try {
      await friendshipsService.removeFriend(friendId)
      alert('Amigo eliminado')
      loadFriendsData()
    } catch (error) {
      console.error('[FRIENDS] Remove error:', error)
      alert('Error al eliminar amigo')
    }
  }

  const FriendCard = ({ friend, showRemove = true }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-medium">
            {friend.name?.charAt(0) || friend.email?.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{friend.name || 'Usuario'}</h3>
            <p className="text-sm text-gray-500">{friend.email}</p>
          </div>
        </div>
        
        {showRemove && (
          <button
            onClick={() => removeFriend(friend.id)}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )

  const RequestCard = ({ request }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-medium">
            {request.sender_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{request.sender_name || 'Usuario'}</h3>
            <p className="text-sm text-gray-500">{request.sender_email}</p>
            {request.message && (
              <p className="text-sm text-gray-600 mt-1 italic">"{request.message}"</p>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => respondToRequest(request.id, true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
          >
            Aceptar
          </button>
          <button
            onClick={() => respondToRequest(request.id, false)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Rechazar
          </button>
        </div>
      </div>
    </div>
  )

  const SearchResultCard = ({ searchUser }) => {
    const isAlreadyFriend = friends.some(f => f.id === searchUser.id)
    const hasPendingRequest = friendRequests.sent.some(r => r.recipient_id === searchUser.id)
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-medium">
              {searchUser.name?.charAt(0) || searchUser.email?.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{searchUser.name || 'Usuario'}</h3>
              <p className="text-sm text-gray-500">{searchUser.email}</p>
            </div>
          </div>
          
          <div>
            {isAlreadyFriend ? (
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm">
                Ya son amigos
              </span>
            ) : hasPendingRequest ? (
              <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                Solicitud enviada
              </span>
            ) : (
              <button
                onClick={() => sendFriendRequest(searchUser.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
              >
                Enviar solicitud
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onNavigate={onNavigate} onLogout={onLogout} />
        <Sidebar currentRoute="friends" onNavigate={onNavigate} />
        
        <div className="lg:ml-20 pt-20">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onNavigate={onNavigate} onLogout={onLogout} />
      <Sidebar currentRoute="friends" onNavigate={onNavigate} />
      
      <div className="lg:ml-20 pt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis Amigos</h1>
            <p className="text-gray-600">
              {friends.length} amigos • {friendRequests.received.length} solicitudes pendientes
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveTab('friends')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'friends'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Mis Amigos ({friends.length})
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'requests'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Solicitudes ({friendRequests.received.length})
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'search'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Buscar Usuarios
              </button>
            </div>

            {/* Search Bar for Search Tab */}
            {activeTab === 'search' && (
              <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Buscar por email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={searchLoading || !searchQuery.trim()}
                  className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {searchLoading ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Friends Tab */}
            {activeTab === 'friends' && (
              <div>
                {friends.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {friends.map(friend => (
                      <FriendCard key={friend.id} friend={friend} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Aún no tienes amigos</h3>
                    <p className="text-gray-600 mb-6">Busca otros usuarios para conectar</p>
                    <button
                      onClick={() => setActiveTab('search')}
                      className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors"
                    >
                      Buscar Usuarios
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Solicitudes Recibidas</h2>
                {friendRequests.received.length > 0 ? (
                  <div className="space-y-4">
                    {friendRequests.received.map(request => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No tienes solicitudes pendientes</h3>
                    <p className="text-gray-600">Las nuevas solicitudes aparecerán aquí</p>
                  </div>
                )}

                {friendRequests.sent.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Solicitudes Enviadas</h2>
                    <div className="space-y-4">
                      {friendRequests.sent.map(request => (
                        <div key={request.id} className="bg-white rounded-xl border border-gray-200 p-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-medium">
                              {request.recipient_name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {request.recipient_name || 'Usuario'}
                              </h3>
                              <p className="text-sm text-gray-500">Solicitud enviada</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Search Tab */}
            {activeTab === 'search' && (
              <div>
                {searchResults.length > 0 ? (
                  <div className="space-y-4">
                    {searchResults.map(searchUser => (
                      <SearchResultCard key={searchUser.id} searchUser={searchUser} />
                    ))}
                  </div>
                ) : searchQuery && !searchLoading ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No se encontraron usuarios</h3>
                    <p className="text-gray-600">Intenta con un email diferente</p>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Buscar Usuarios</h3>
                    <p className="text-gray-600">Ingresa un email para buscar otros usuarios</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Friends