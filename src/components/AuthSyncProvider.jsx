'use client'

// React Imports
import { useEffect } from 'react'

// Hook Imports
import useAuthSync from '@/hooks/useAuthSync'

/**
 * Component to handle authentication synchronization
 * This component ensures that the API client stays in sync with NextAuth session
 */
const AuthSyncProvider = ({ children }) => {
  // Initialize auth sync
  useAuthSync()

  return children
}

export default AuthSyncProvider