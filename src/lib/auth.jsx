import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext(null)

/**
 * Centralized auth method wrapper.
 *
 * Every exported auth method is routed through this helper so that:
 *  - Errors are caught and logged in one place.
 *  - The return shape is always `{ data, error }`.
 *  - The optional loading setter is called before/after the operation.
 *  - Future concerns (metrics, telemetry, rate-limiting, etc.) can be added
 *    here without touching call sites.
 *
 * @param {string}              label       Human-readable method name for logs.
 * @param {Function}            fn          The actual Supabase auth call.
 * @param {Function|null}       [setLoading] Optional state setter to toggle during execution.
 * @returns {Promise<{data: unknown, error: Error|null}>}
 */
async function authHandler(label, fn, setLoading) {
  setLoading?.(true)
  try {
    console.debug(`[Auth] ${label} — started`)
    const result = await fn()
    if (result?.error) {
      console.error(`[Auth] ${label} — error`, result.error)
    } else {
      console.debug(`[Auth] ${label} — succeeded`)
    }
    return result ?? { data: null, error: null }
  } catch (err) {
    console.error(`[Auth] ${label} — unexpected exception`, err)
    return { data: null, error: err }
  } finally {
    setLoading?.(false)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // ------------------------------------------------------------------
  // Wrapped auth methods — consistent API surface for all consumers.
  // Each method delegates to authHandler which handles try/catch,
  // logging, loading state, and returns a uniform `{ data, error }`.
  // ------------------------------------------------------------------

  const signIn = useCallback(
    (options) => authHandler('signIn', () => supabase.auth.signInWithPassword(options), setAuthLoading),
    [],
  )

  const signOut = useCallback(
    () => authHandler('signOut', () => supabase.auth.signOut(), setAuthLoading),
    [],
  )

  const resetPassword = useCallback(
    (email) => authHandler('resetPassword', () => supabase.auth.resetPasswordForEmail(email), setAuthLoading),
    [],
  )

  const refreshSession = useCallback(
    (currentRefreshToken) =>
      authHandler(
        'refreshSession',
        () =>
          currentRefreshToken
            ? supabase.auth.refreshSession({ refresh_token: currentRefreshToken })
            : supabase.auth.refreshSession(),
        setAuthLoading,
      ),
    [],
  )

  const signUp = useCallback(
    (options) => authHandler('signUp', () => supabase.auth.signUp(options), setAuthLoading),
    [],
  )

  const getSession = useCallback(
    () => authHandler('getSession', () => supabase.auth.getSession()),
    [],
  )

  const onAuthStateChange = useCallback(
    (callback) => supabase.auth.onAuthStateChange(callback),
    [],
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authLoading,
        signIn,
        signOut,
        resetPassword,
        refreshSession,
        signUp,
        getSession,
        onAuthStateChange,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
