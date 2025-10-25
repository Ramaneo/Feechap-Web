// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'

// Next Imports
import Link from 'next/link'

const NotFoundPage = ({ params }) => {
  return (
    <Box className="container mx-auto p-6">
      <Paper className="p-8 text-center">
        <Box className="mb-6">
          <i className="tabler-error-404 text-8xl text-gray-400" />
        </Box>
        
        <Typography variant="h4" className="mb-4">
          دسته‌بندی قیمت یافت نشد
        </Typography>
        
        <Typography variant="body1" color="textSecondary" className="mb-6">
          دسته‌بندی قیمت مورد نظر شما موجود نیست یا حذف شده است.
        </Typography>

        <Link href={`/${params.lang}/prices`} passHref>
          <Button variant="contained" color="primary">
            بازگشت به صفحه قیمت‌ها
          </Button>
        </Link>
      </Paper>
    </Box>
  )
}

export default NotFoundPage
