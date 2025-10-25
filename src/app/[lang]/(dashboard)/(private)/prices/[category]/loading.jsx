// MUI Imports
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const LoadingPage = () => {
  return (
    <Box 
      className="flex flex-col items-center justify-center min-h-[400px] gap-4"
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="textSecondary">
        در حال بارگذاری جدول قیمت...
      </Typography>
    </Box>
  )
}

export default LoadingPage