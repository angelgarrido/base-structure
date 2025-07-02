/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: mockfile< */

// biome-ignore lint/correctness/noUnusedImports: mockFile
import React, { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'

// Mock auth client for development

const client = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  authorize: async (origin: string, type: string, options: Record<string, unknown>) => ({
    challenge: { state: 'mock', verifier: 'mock' },
    url: '#',
  }),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  exchange: async (code: string, origin: string, verifier: string) => ({
    err: null,
    tokens: { access: 'mock-token', refresh: 'mock-refresh' },
  }),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refresh: async (refresh: string, options: Record<string, unknown>) => ({
    err: null,
    tokens: { access: 'mock-token', refresh: 'mock-refresh' },
  }),
}

import { AuthContext } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const initializing = useRef(true)
  const [loaded, setLoaded] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const token = useRef<string | undefined>(undefined)
  const [userId, setUserId] = useState<string | undefined>()

  async function auth() {
    const token = await refreshTokens()

    if (token) {
      await user()
    }

    setLoaded(true)
  }

  async function callback(code: string, state: string) {
    console.log('callback', code, state)
    const challengeStr = sessionStorage.getItem('challenge')
    if (!challengeStr) return
    const challenge = JSON.parse(challengeStr)
    if (code) {
      if (state === challenge.state && challenge.verifier) {
        const exchanged = await client.exchange(code, location.origin, challenge.verifier)
        if (!exchanged.err) {
          token.current = exchanged.tokens?.access
          localStorage.setItem('refresh', exchanged.tokens.refresh)
        }
      }
      window.location.replace('/')
    }
  }

  const memoizedAuth = useCallback(auth, [])
  const memoizedCallback = useCallback(callback, [])

  useEffect(() => {
    const hash = new URLSearchParams(location.search.slice(1))
    const code = hash.get('code')
    const state = hash.get('state')

    if (!initializing.current) {
      return
    }

    initializing.current = false

    if (code && state) {
      memoizedCallback(code, state)
      return
    }

    memoizedAuth()
  }, [memoizedAuth, memoizedCallback])

  async function refreshTokens() {
    const refresh = localStorage.getItem('refresh')
    if (!refresh) return
    const next = await client.refresh(refresh, {
      access: token.current,
    })
    if (next.err) return
    if (!next.tokens) return token.current

    localStorage.setItem('refresh', next.tokens.refresh)
    token.current = next.tokens.access

    return next.tokens.access
  }

  async function getToken() {
    const token = await refreshTokens()

    if (!token) {
      await login()
      return
    }

    return token
  }

  async function login() {
    const { challenge, url } = await client.authorize(location.origin, 'code', {
      pkce: true,
    })
    sessionStorage.setItem('challenge', JSON.stringify(challenge))
    location.href = url
  }

  async function user() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}me`, {
      headers: {
        Authorization: `Bearer ${token.current}`,
      },
    })

    if (res.ok) {
      const user = await res.json()
      setUserId(user.userId)
      setLoggedIn(true)
    }
  }

  function logout() {
    localStorage.removeItem('refresh')
    token.current = undefined

    window.location.replace('/')
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        userId,
        loaded,
        loggedIn,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
