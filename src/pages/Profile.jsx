import { useState, useEffect } from 'react'
import { authService } from '../services/api/authService.js'
import { friendshipsService } from '../services/api/friendshipsService.js'
import { debugToken, testEndpoint } from '../utils/debugToken.js'

function Profile({ user, setUser }) {
  const [tab, setTab] = useState('personal')
  const [friends, setFriends] = useState([])
  const [friendRequests, setFriendRequests] = useState({ received: [], sent: [] })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [message, setMessage] = useState('')
  const [uploadLoading, setUploadLoading] = useState(false)

  useEffect(() => {
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
    if (!file) return
    
    setUploadLoading(true)
    setMessage('')
    
    try {
      console.log('[PROFILE] Starting upload with corrected service...')
      
      // Usar el servicio corregido
      const result = await authService.uploadProfilePhoto(file)
      console.log('[PROFILE] Upload success:', result)
      
      // Actualizar user con nueva foto
      const updatedUser = { ...user, profile_photo_url: result.profile_photo_url }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      setMessage('Foto actualizada correctamente')
      
    } catch (error) {
      console.error('[PROFILE] [ERROR] Upload failed:', error)
      setMessage(`Error al subir foto: ${error.toString()}`)
    } finally {
      setUploadLoading(false)
    }
  }

  const runDebugTests = async () => {
    console.log('\n=== DEBUG SESSION START ===')
    
    // 1. Debug token
    debugToken()
    
    // 2. Test profile endpoint
    await testEndpoint('/auth/profile')
    
    // 3. Test upload endpoint with empty FormData
    const testFormData = new FormData()
    testFormData.append('file', new Blob(['test'], { type: 'image/jpeg' }), 'test.jpg')
    await testEndpoint('/auth/upload-profile-photo', 'POST', testFormData)
    
    console.log('=== DEBUG SESSION END ===\n')
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Perfil</h1>

      {/* Debug Controls */}
      <div style={{ backgroundColor: '#f0f0f0', padding: '15px', marginBottom: '20px' }}>
        <h3>🔧 Debug Controls</h3>
        <button onClick={runDebugTests} style={{ marginRight: '10px', padding: '10px' }}>
          Run Debug Tests
        </button>
        <button onClick={refreshUserProfile} style={{ marginRight: '10px', padding: '10px' }}>
          Refresh Profile
        </button>
        <button onClick={() => console.log('Current user:', user)} style={{ padding: '10px' }}>
          Log User State
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
              disabled={uploadLoading}
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) {
                  console.log('[PROFILE] File selected:', {
                    name: file.name,
                    size: file.size,
                    type: file.type
                  })
                  uploadPhoto(file)
                }
              }}
            />
            {uploadLoading && <p>Subiendo foto...</p>}
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