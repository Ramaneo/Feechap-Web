// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

// Util Imports
import { getDictionary } from '@/utils/getDictionary'

// Price categories with their metadata
const PRICE_CATEGORIES = [
  {
    key: 'papers',
    title: 'قیمت کاغذ',
    description: 'مدیریت قیمت انواع کاغذ و مقوا',
    icon: 'tabler-file-text',
    color: 'primary'
  },
  {
    key: 'uvs',
    title: 'قیمت UV',
    description: 'مدیریت قیمت UV و پوشش‌های محافظ',
    icon: 'tabler-sun',
    color: 'warning'
  },
  {
    key: 'cuts',
    title: 'قیمت برش',
    description: 'مدیریت قیمت انواع برش و بریدگی',
    icon: 'tabler-cut',
    color: 'error'
  },
  {
    key: 'lithographies',
    title: 'قیمت لیتوگرافی',
    description: 'مدیریت قیمت چاپ لیتوگرافی',
    icon: 'tabler-print',
    color: 'info'
  },
  {
    key: 'monitorings',
    title: 'قیمت نظارت',
    description: 'مدیریت قیمت نظارت و بازرسی',
    icon: 'tabler-eye',
    color: 'success'
  },
  {
    key: 'colors',
    title: 'قیمت ماشین افست',
    description: 'مدیریت قیمت ماشین‌های افست',
    icon: 'tabler-palette',
    color: 'secondary'
  },
  {
    key: 'circulations',
    title: 'قیمت تیراژ افست',
    description: 'مدیریت قیمت بر اساس تیراژ',
    icon: 'tabler-copy',
    color: 'primary'
  },
  {
    key: 'selefons',
    title: 'قیمت سلفون',
    description: 'مدیریت قیمت سلفون و روکش',
    icon: 'tabler-layers',
    color: 'warning'
  },
  {
    key: 'laminates',
    title: 'قیمت لمینیت',
    description: 'مدیریت قیمت لمینیت و پوشش',
    icon: 'tabler-layers-intersect',
    color: 'info'
  },
  {
    key: 'boxes',
    title: 'قیمت جعبه',
    description: 'مدیریت قیمت انواع جعبه و بسته‌بندی',
    icon: 'tabler-box',
    color: 'success'
  },
  {
    key: 'pockets',
    title: 'قیمت بسته‌بندی',
    description: 'مدیریت قیمت انواع بسته‌بندی',
    icon: 'tabler-package',
    color: 'error'
  },
  {
    key: 'bags',
    title: 'قیمت کیسه',
    description: 'مدیریت قیمت انواع کیسه و ساک',
    icon: 'tabler-shopping-bag',
    color: 'secondary'
  },
  {
    key: 'binderies',
    title: 'قیمت صحافی',
    description: 'مدیریت قیمت انواع صحافی',
    icon: 'tabler-book',
    color: 'primary'
  },
  {
    key: 'framings',
    title: 'قیمت قالب‌سازی',
    description: 'مدیریت قیمت ساخت قالب',
    icon: 'tabler-frame',
    color: 'warning'
  },
  {
    key: 'plates',
    title: 'قیمت کلیشه‌سازی',
    description: 'مدیریت قیمت ساخت کلیشه',
    icon: 'tabler-stamp',
    color: 'info'
  },
  {
    key: 'golds',
    title: 'قیمت طلاکوب',
    description: 'مدیریت قیمت طلاکوب و نقره‌کوب',
    icon: 'tabler-star',
    color: 'warning'
  },
  {
    key: 'letterpress',
    title: 'قیمت چاپ لترپرس',
    description: 'مدیریت قیمت چاپ لترپرس',
    icon: 'tabler-typography',
    color: 'error'
  },
  {
    key: 'glues',
    title: 'قیمت سرچسب',
    description: 'مدیریت قیمت انواع برچسب',
    icon: 'tabler-sticker',
    color: 'success'
  },
  {
    key: 'numerations',
    title: 'قیمت شماره‌زنی',
    description: 'مدیریت قیمت شماره‌زنی',
    icon: 'tabler-numbers',
    color: 'secondary'
  },
  {
    key: 'perforages',
    title: 'قیمت پرفراژ',
    description: 'مدیریت قیمت پرفراژ و سوراخ‌کاری',
    icon: 'tabler-dots',
    color: 'primary'
  },
  {
    key: 'others',
    title: 'سایر قیمت‌ها',
    description: 'مدیریت سایر خدمات و قیمت‌ها',
    icon: 'tabler-dots-vertical',
    color: 'info'
  }
]

const PricesPage = async ({ params }) => {
  // Get dictionary for translations
  const dictionary = await getDictionary(params.lang)

  return (
    <div className="container mx-auto p-6">
      <Box className="mb-6">
        <Typography variant="h4" className="mb-2">
          مدیریت قیمت‌ها
        </Typography>
        <Typography variant="body1" color="textSecondary">
          مدیریت قیمت‌های مختلف خدمات چاپ و تولید
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {PRICE_CATEGORIES.map((category) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={category.key}>
            <Link 
              href={`/${params.lang}/prices/${category.key}`}
              style={{ textDecoration: 'none' }}
            >
              <Card 
                className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
                sx={{
                  '&:hover': {
                    boxShadow: 3
                  }
                }}
              >
                <CardContent className="text-center p-6">
                  <Box className="mb-4">
                    <i 
                      className={`${category.icon} text-4xl`}
                      style={{ 
                        color: `var(--mui-palette-${category.color}-main)` 
                      }}
                    />
                  </Box>
                  
                  <Typography variant="h6" className="mb-2">
                    {category.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    className="mb-3"
                  >
                    {category.description}
                  </Typography>

                  <Chip
                    label="مشاهده جدول قیمت"
                    color={category.color}
                    variant="outlined"
                    size="small"
                  />
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default PricesPage
