// Component Imports
import AuthDebugPanel from '@/components/debug/AuthDebugPanel'

// MUI Imports
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const AuthDebugPage = () => {
  return (
    <Container maxWidth="lg" className="py-6">
      <Box className="mb-6">
        <Typography variant="h4" className="mb-2">
          Authentication Debug
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Use this page to debug authentication issues and verify token synchronization
        </Typography>
      </Box>

      <AuthDebugPanel />
    </Container>
  )
}

export default AuthDebugPage