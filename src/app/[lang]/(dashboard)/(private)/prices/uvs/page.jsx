'use client'

// Component Imports
import PriceTableContainer from '@/components/prices/PriceTableContainer'

// Define columns for UV coating price table
const uvColumns = [
  {
    field: 'type',
    headerName: 'نوع UV',
    width: 180,
    editable: true,
    type: 'singleSelect',
    valueOptions: [
      { value: 'full', label: 'تمام سطح' },
      { value: 'spot', label: 'نقطه‌ای' },
      { value: 'pattern', label: 'طرح‌دار' }
    ]
  },
  {
    field: 'size_category',
    headerName: 'دسته‌بندی اندازه',
    width: 180,
    editable: true,
    type: 'singleSelect',
    valueOptions: [
      { value: 'small', label: 'کوچک (تا A4)' },
      { value: 'medium', label: 'متوسط (تا A3)' },
      { value: 'large', label: 'بزرگ (تا A2)' },
      { value: 'xl', label: 'خیلی بزرگ (A1+)' }
    ]
  },
  {
    field: 'price_per_sheet',
    headerName: 'قیمت هر برگ',
    width: 150,
    editable: true,
    type: 'number',
    valueFormatter: params => {
      return params ? `${params.toLocaleString('fa-IR')} تومان` : ''
    }
  },
  {
    field: 'minimum_sheets',
    headerName: 'حداقل تیراژ',
    width: 130,
    editable: true,
    type: 'number'
  },
  {
    field: 'setup_cost',
    headerName: 'هزینه راه‌اندازی',
    width: 160,
    editable: true,
    type: 'number',
    valueFormatter: params => {
      return params ? `${params.toLocaleString('fa-IR')} تومان` : ''
    }
  },
  {
    field: 'processing_time',
    headerName: 'زمان انجام (روز)',
    width: 150,
    editable: true,
    type: 'number'
  }
]

// Default values for new UV entries
const defaultUvValues = {
  type: 'full',
  size_category: 'small',
  price_per_sheet: 0,
  minimum_sheets: 100,
  setup_cost: 0,
  processing_time: 1
}

const UvsPage = () => {
  return <PriceTableContainer category='uvs' title='جدول قیمت UV' columns={uvColumns} defaultValues={defaultUvValues} />
}

export default UvsPage
