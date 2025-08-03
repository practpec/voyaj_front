import { useState, useEffect } from 'react'
import { authService } from '../services/api/authService.js'
import { friendshipsService } from '../services/api/friendshipsService.js'

function Profile({ user, setUser }) {
  const [tab, setTab] = useState('personal')
  const [friends, setFriends] = useState([])
  const [friendRequests, setFriendRequests] = useState({ received: [], sent: [] })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Refrescar datos del usuario al cargar el perfil
    refreshUserProfile()
    
    if (tab === 'friends') {
      loadFriendsData()
    }
  }, [tab])

  const refreshUserProfile = async () => {
    try {
      const freshUserData = await authService.getProfile()
      console.log('[PROFILE] Fresh user data:', freshUserData)
      setUser(freshUserData)
      
      // También actualizar en localStorage
      localStorage.setItem('user', JSON.stringify(freshUserData))
    } catch (error) {
      console.error('[PROFILE] [ERROR] Failed to refresh profile:', error)
    }
  }

  const loadFriendsData = async () => {
    try {
      const [friendsData, requestsData] = await Promise.all([
        friendshipsService.getFriends(),
        friendshipsService.getFriendRequests()
      ])
      setFriends(friendsData)
      setFriendRequests(requestsData)
    } catch (error) {
      setMessage(error.toString())
    }
  }

  const handleSearch = async () => {
    if (searchQuery.length < 2) return
    try {
      const results = await authService.searchUsers(searchQuery)
      setSearchResults(results)
    } catch (error) {
      setMessage(error.toString())
    }
  }

  const sendFriendRequest = async (userId) => {
    try {
      await friendshipsService.sendFriendRequest({ recipient_id: userId })
      setMessage('Solicitud enviada')
      loadFriendsData()
    } catch (error) {
      setMessage(error.toString())
    }
  }

  const respondToRequest = async (requestId, accept) => {
    try {
      await friendshipsService.respondToRequest(requestId, { accept })
      setMessage(accept ? 'Solicitud aceptada' : 'Solicitud rechazada')
      loadFriendsData()
    } catch (error) {
      setMessage(error.toString())
    }
  }

  const removeFriend = async (friendId) => {
    try {
      await friendshipsService.removeFriend(friendId)
      setMessage('Amigo eliminado')
      loadFriendsData()
    } catch (error) {
      setMessage(error.toString())
    }
  }

  const uploadPhoto = async (file) => {
    try {
      console.log('[PROFILE] Starting photo upload process...')
      
      // Test: Hacer una request manual para debug
      const token = localStorage.getItem('access_token')
      const formData = new FormData()
      formData.append('file', file)
      
      console.log('[PROFILE] Manual fetch attempt with:', {
        url: 'http://localhost:8000/auth/upload-profile-photo',
        hasToken: !!token,
        tokenStart: token?.substring(0, 20),
        fileSize: file.size
      })
      
      const response = await fetch('http://localhost:8000/auth/upload-profile-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      console.log('[PROFILE] Manual fetch response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('[PROFILE] Manual fetch error response:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      const result = await response.json()
      console.log('[PROFILE] Manual fetch success:', result)
      
      setUser({ ...user, profile_photo_url: result.profile_photo_url })
      setMessage('Foto actualizada correctamente')
      
    } catch (error) {
      console.error('[PROFILE] [ERROR] Upload failed:', error)
      setMessage(`Error al subir foto: ${error.toString()}`)
    }
  }

  // Test endpoints
  const testEndpoints = async () => {
    const token = localStorage.getItem('access_token')
    console.log('[PROFILE] Testing endpoints with token:', token?.substring(0, 20))
    
    const endpoints = [
      '/auth/profile',
      '/auth/upload-profile-photo'
    ]
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`http://localhost:8000${endpoint}`, {
          method: endpoint.includes('upload') ? 'POST' : 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            ...(endpoint.includes('upload') ? {} : { 'Content-Type': 'application/json' })
          },
          ...(endpoint.includes('upload') ? { body: new FormData() } : {})
        })
        
        console.log(`[PROFILE] Test ${endpoint}:`, {
          status: response.status,
          statusText: response.statusText
        })
      } catch (error) {
        console.error(`[PROFILE] Test ${endpoint} failed:`, error)
      }
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Perfil</h1>

      {/* Debug Controls */}
      <div style={{ backgroundColor: '#f0f0f0', padding: '15px', marginBottom: '20px' }}>
        <h3>🔧 Debug Controls</h3>
        <button onClick={testEndpoints} style={{ marginRight: '10px', padding: '10px' }}>
          Test Endpoints
        </button>
        <button onClick={refreshUserProfile} style={{ padding: '10px' }}>
          Refresh Profile
        </button>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setTab('personal')}
          style={{ padding: '10px', marginRight: '10px', backgroundColor: tab === 'personal' ? '#ddd' : '' }}
        >
          Personal
        </button>
        <button 
          onClick={() => setTab('friends')}
          style={{ padding: '10px', backgroundColor: tab === 'friends' ? '#ddd' : '' }}
        >
          Amigos
        </button>
      </div>

      {message && <div style={{ color: message.includes('Error') ? 'red' : 'green', marginBottom: '15px' }}>
        {message}
      </div>}

      {/* Personal Tab */}
      {tab === 'personal' && (
        <div>
          <h2>Información Personal</h2>
          
          {/* Debug Info */}
          <div style={{ backgroundColor: '#f5f5f5', padding: '10px', marginBottom: '15px' }}>
            <h3>Debug Info:</h3>
            <p>User ID: {user.id}</p>
            <p>Email: {user.email}</p>
            <p>Email verificado (user object): {user.email_verified ? 'Sí' : 'No'}</p>
            <p>Tiene foto: {user.profile_photo_url ? 'Sí' : 'No'}</p>
            <p>Token presente: {localStorage.getItem('access_token') ? 'Sí' : 'No'}</p>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Email verificado:</strong> {user.email_verified ? '✅ Sí' : '❌ No'}</p>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <h3>Foto de Perfil</h3>
            {user.profile_photo_url ? (
              <div>
                <img 
                  src={user.profile_photo_url} 
                  alt="Perfil" 
                  style={{ width: '100px', height: '100px', objectFit: 'cover', border: '1px solid #ccc' }} 
                />
                <p>Foto actual cargada</p>
              </div>
            ) : (
              <p>Sin foto de perfil</p>
            )}
            
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) {
                  console.log('[PROFILE] File selected:', file.name, file.size, 'bytes')
                  uploadPhoto(file)
                }
              }}
            />
          </div>

          {!user.email_verified && (
            <div style={{ backgroundColor: '#ffe6e6', padding: '15px', border: '1px solid red' }}>
              <p>⚠️ Tu email no está verificado</p>
              <button 
                onClick={async () => {
                  try {
                    await authService.sendVerificationEmail()
                    setMessage('Código de verificación enviado')
                  } catch (error) {
                    setMessage(`Error: ${error.toString()}`)
                  }
                }}
                style={{ padding: '10px', backgroundColor: 'orange', color: 'white' }}
              >
                Enviar código de verificación
              </button>
            </div>
          )}
        </div>
      )}

      {/* Friends Tab */}
      {tab === 'friends' && (
        <div>
          <h2>Gestión de Amigos</h2>

          {/* Search Users */}
          <div style={{ marginBottom: '20px' }}>
            <h3>Buscar Usuarios</h3>
            <input
              type="text"
              placeholder="Buscar por email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '10px', width: '300px' }}
            />
            <button onClick={handleSearch} style={{ marginLeft: '10px', padding: '10px' }}>
              Buscar
            </button>
            
            {searchResults.map(user => (
              <div key={user.id} style={{ padding: '10px', border: '1px solid #ccc', margin: '10px 0' }}>
                <span>{user.name} ({user.email})</span>
                <button 
                  onClick={() => sendFriendRequest(user.id)}
                  style={{ marginLeft: '10px', padding: '5px' }}
                >
                  Enviar Solicitud
                </button>
              </div>
            ))}
          </div>

          {/* Friend Requests */}
          <div style={{ marginBottom: '20px' }}>
            <h3>Solicitudes Recibidas</h3>
            {friendRequests.received.map(request => (
              <div key={request.id} style={{ padding: '10px', border: '1px solid #ccc', margin: '10px 0' }}>
                <span>Solicitud de: {request.sender_id}</span>
                <button 
                  onClick={() => respondToRequest(request.id, true)}
                  style={{ marginLeft: '10px', padding: '5px' }}
                >
                  Aceptar
                </button>
                <button 
                  onClick={() => respondToRequest(request.id, false)}
                  style={{ marginLeft: '10px', padding: '5px' }}
                >
                  Rechazar
                </button>
              </div>
            ))}
          </div>

          {/* Friends List */}
          <div>
            <h3>Mis Amigos ({friends.length})</h3>
            {friends.map(friend => (
              <div key={friend.id} style={{ padding: '10px', border: '1px solid #ccc', margin: '10px 0' }}>
                <span>{friend.name} ({friend.email})</span>
                <button 
                  onClick={() => removeFriend(friend.id)}
                  style={{ marginLeft: '10px', padding: '5px', backgroundColor: 'red', color: 'white' }}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile