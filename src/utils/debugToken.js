// Debug utility para verificar el estado del token
export const debugToken = () => {
  const token = localStorage.getItem('access_token')
  const user = localStorage.getItem('user')
  
  console.log('[TOKEN_DEBUG] Status:', {
    hasToken: !!token,
    hasUser: !!user,
    tokenType: typeof token,
    tokenLength: token?.length,
    tokenStart: token?.substring(0, 30),
    tokenEnd: token?.substring(token?.length - 10),
    hasQuotes: token?.includes('"'),
    userEmail: user ? JSON.parse(user).email : 'No user'
  })
  
  // Intentar decodificar el JWT (solo la parte del payload)
  if (token) {
    try {
      const cleanToken = token.replace(/^["']|["']$/g, '').trim()
      const parts = cleanToken.split('.')
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]))
        console.log('[TOKEN_DEBUG] JWT Payload:', {
          sub: payload.sub,
          email: payload.email,
          exp: new Date(payload.exp * 1000).toISOString(),
          type: payload.type,
          isExpired: payload.exp * 1000 < Date.now()
        })
      }
    } catch (e) {
      console.error('[TOKEN_DEBUG] JWT decode failed:', e)
    }
  }
  
  return { token, user }
}

// Test manual de un endpoint
export const testEndpoint = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('access_token')
  const cleanToken = token?.replace(/^["']|["']$/g, '').trim()
  
  console.log(`[ENDPOINT_TEST] Testing ${method} ${endpoint}`)
  
  try {
    const config = {
      method,
      headers: {
        'Authorization': `Bearer ${cleanToken}`
      }
    }
    
    if (body && !(body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
      config.body = JSON.stringify(body)
    } else if (body instanceof FormData) {
      config.body = body
    }
    
    const response = await fetch(`http://localhost:8000${endpoint}`, config)
    
    console.log(`[ENDPOINT_TEST] Response:`, {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[ENDPOINT_TEST] Error:`, errorText)
      return { error: errorText, status: response.status }
    }
    
    const data = await response.json()
    console.log(`[ENDPOINT_TEST] Success:`, data)
    return data
    
  } catch (error) {
    console.error(`[ENDPOINT_TEST] Exception:`, error)
    return { error: error.message }
  }
}