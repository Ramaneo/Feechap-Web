'use client'

// React Imports
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

// Service Imports
import apiClient from '@/libs/apiClient'

/**
 * Hook to synchronize NextAuth session token with API client
 * This ensures that the API client always has the latest authentication token
 */
export const useAuthSync = () => {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.accessToken) {
      // Sync the NextAuth token with the API client
      apiClient.setAuthToken(session.user.accessToken)
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Token synced with API client:', {
          tokenPreview: session.user.accessToken.substring(0, 10) + '...',
          userId: session.user.id,
          mobile: session.user.mobile
        })
      }
    } else if (status === 'unauthenticated') {
      // Clear token when user is not authenticated
      apiClient.clearStoredToken()
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Token cleared from API client')
      }
    }
  }, [session, status])

  return {
    isAuthenticated: status === 'authenticated',
    user: session?.user || null,
    status
  }
}

export default useAuthSync