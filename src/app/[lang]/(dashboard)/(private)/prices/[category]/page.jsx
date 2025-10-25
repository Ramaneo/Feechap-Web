// Next Imports
import { notFound } from 'next/navigation'

// Component Imports
import PriceTableContainer from '@/components/prices/PriceTableContainer'

// Util Imports
import { getDictionary } from '@/utils/getDictionary'

// Price category configurations
const PRICE_CATEGORIES = {
  papers: {
    title: 'قیمت کاغذ',
    description: 'مدیریت قیمت انواع کاغذ'
  },
  uvs: {
    title: 'قیمت UV',
    description: 'مدیریت قیمت UV'
  },
  cuts: {
    title: 'قیمت برش',
    description: 'مدیریت قیمت برش'
  },
  lithographies: {
    title: 'قیمت لیتوگرافی',
    description: 'مدیریت قیمت لیتوگرافی'
  },
  monitorings: {
    title: 'قیمت نظارت',
    description: 'مدیریت قیمت نظارت'
  },
  colors: {
    title: 'قیمت ماشین افست',
    description: 'مدیریت قیمت ماشین افست'
  },
  circulations: {
    title: 'قیمت تیراژ افست',
    description: 'مدیریت قیمت تیراژ افست'
  },
  selefons: {
    title: 'قیمت سلفون',
    description: 'مدیریت قیمت سلفون'
  },
  laminates: {
    title: 'قیمت لمینیت',
    description: 'مدیریت قیمت لمینیت'
  },
  boxes: {
    title: 'قیمت جعبه',
    description: 'مدیریت قیمت جعبه'
  },
  pockets: {
    title: 'قیمت بسته‌بندی',
    description: 'مدیریت قیمت بسته‌بندی'
  },
  bags: {
    title: 'قیمت کیسه',
    description: 'مدیریت قیمت کیسه'
  },
  binderies: {
    title: 'قیمت صحافی',
    description: 'مدیریت قیمت صحافی'
  },
  framings: {
    title: 'قیمت قالب‌سازی',
    description: 'مدیریت قیمت قالب‌سازی'
  },
  plates: {
    title: 'قیمت کلیشه‌سازی',
    description: 'مدیریت قیمت کلیشه‌سازی'
  },
  golds: {
    title: 'قیمت طلاکوب',
    description: 'مدیریت قیمت طلاکوب'
  },
  letterpress: {
    title: 'قیمت چاپ لترپرس',
    description: 'مدیریت قیمت چاپ لترپرس'
  },
  glues: {
    title: 'قیمت سرچسب',
    description: 'مدیریت قیمت سرچسب'
  },
  numerations: {
    title: 'قیمت شماره‌زنی',
    description: 'مدیریت قیمت شماره‌زنی'
  },
  perforages: {
    title: 'قیمت پرفراژ',
    description: 'مدیریت قیمت پرفراژ'
  },
  others: {
    title: 'سایر قیمت‌ها',
    description: 'مدیریت سایر قیمت‌ها'
  }
}

const PriceCategoryPage = async ({ params }) => {
  // Get dictionary for translations
  const dictionary = await getDictionary(params.lang)
  
  // Get category configuration
  const categoryConfig = PRICE_CATEGORIES[params.category]
  
  // If category doesn't exist, show 404
  if (!categoryConfig) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6">
      <PriceTableContainer
        category={params.category}
        title={categoryConfig.title}
        description={categoryConfig.description}
      />
    </div>
  )
}

export default PriceCategoryPage

// Generate static params for all price categories
export async function generateStaticParams({ params }) {
  const categories = Object.keys(PRICE_CATEGORIES)
  
  return categories.map((category) => ({
    category: category
  }))
}

// Generate metadata
export async function generateMetadata({ params }) {
  const categoryConfig = PRICE_CATEGORIES[params.category]
  
  if (!categoryConfig) {
    return {
      title: 'صفحه یافت نشد'
    }
  }

  return {
    title: categoryConfig.title,
    description: categoryConfig.description
  }
}