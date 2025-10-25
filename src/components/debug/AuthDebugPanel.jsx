'use client'

// React Imports
import { useState } from 'react'
import { useSession } from 'next-auth/react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'

// Service Imports
import { priceService } from '@/services'
import apiClient from '@/libs/apiClient'

const AuthDebugPanel = () => {
  const { data: session, status } = useSession()
  const [testResult, setTestResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const testAuthStatus = () => {
    const authStatus = priceService.testAuth()
    const sessionInfo = {
      status,
      isAuthenticated: status === 'authenticated',
      hasSession: !!session,
      sessionToken: session?.user?.accessToken ? 
        `${session.user.accessToken.substring(0, 10)}...` : null,
      userId: session?.user?.id,
      mobile: session?.user?.mobile
    }

    setTestResult({
      apiClient: authStatus,
      nextAuth: sessionInfo,
      timestamp: new Date().toISOString()
    })
  }

  const testApiCall = async () => {
    setLoading(true)
    try {
      const result = await priceService.getPriceTable('papers')
      setTestResult(prev => ({
        ...prev,
        apiTest: {
          success: true,
          message: 'API call successful',
          dataReceived: !!result
        }
      }))
    } catch (error) {
      setTestResult(prev => ({
        ...prev,
        apiTest: {
          success: false,
          error: error.message,
          status: error.response?.status
        }
      }))
    } finally {
      setLoading(false)
    }
  }

  const forceTokenSync = () => {
    if (session?.user?.accessToken) {
      apiClient.setAuthToken(session.user.accessToken)
      setTestResult(prev => ({
        ...prev,
        tokenSync: {
          success: true,
          message: 'Token manually synced with API client'
        }
      }))
    } else {
      setTestResult(prev => ({
        ...prev,
        tokenSync: {
          success: false,
          message: 'No session token available to sync'
        }
      }))
    }
  }

  return (
    <Card>
      <CardHeader
        title="Authentication Debug Panel"
        subheader="Debug authentication status and token synchronization"
      />
      <CardContent>
        <Box className="flex gap-2 mb-4">
          <Button variant="outlined" onClick={testAuthStatus}>
            Check Auth Status
          </Button>
          <Button variant="outlined" onClick={testApiCall} disabled={loading}>
            Test API Call
          </Button>
          <Button variant="outlined" onClick={forceTokenSync}>
            Force Token Sync
          </Button>
        </Box>

        {/* Session Status */}
        <Box className="mb-4">
          <Typography variant="h6" className="mb-2">
            NextAuth Status
          </Typography>
          <Chip
            label={status}
            color={status === 'authenticated' ? 'success' : 'error'}
            variant="outlined"
          />
          {session?.user && (
            <Box className="mt-2">
              <Typography variant="body2">
                User ID: {session.user.id}
              </Typography>
              <Typography variant="body2">
                Mobile: {session.user.mobile}
              </Typography>
              <Typography variant="body2">
                Has Token: {session.user.accessToken ? 'Yes' : 'No'}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Test Results */}
        {testResult && (
          <Box>
            <Typography variant="h6" className="mb-2">
              Test Results
            </Typography>
            
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>

            {testResult.apiTest && (
              <Alert 
                severity={testResult.apiTest.success ? 'success' : 'error'}
                className="mt-2"
              >
                {testResult.apiTest.success 
                  ? 'API authentication is working correctly!' 
                  : `API call failed: ${testResult.apiTest.error}`
                }
              </Alert>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default AuthDebugPanel