'use client'

// Component Imports
import PriceTableContainer from '@/components/prices/PriceTableContainer'

// Define columns for papers price table
const paperColumns = [
  {
    field: 'name',
    headerName: 'نام کاغذ',
    width: 200,
    editable: true,
    type: 'string'
  },
  {
    field: 'size',
    headerName: 'اندازه',
    width: 150,
    editable: true,
    type: 'string'
  },
  {
    field: 'weight',
    headerName: 'گرماژ',
    width: 120,
    editable: true,
    type: 'number'
  },
  {
    field: 'unit_price',
    headerName: 'قیمت واحد',
    width: 150,
    editable: true,
    type: 'number',
    valueFormatter: params => {
      return params ? `${params.toLocaleString('fa-IR')} تومان` : ''
    }
  },
  {
    field: 'minimum_order',
    headerName: 'حداقل سفارش',
    width: 150,
    editable: true,
    type: 'number'
  },
  {
    field: 'availability',
    headerName: 'موجودی',
    width: 120,
    editable: true,
    type: 'singleSelect',
    valueOptions: [
      { value: 'available', label: 'موجود' },
      { value: 'limited', label: 'محدود' },
      { value: 'unavailable', label: 'ناموجود' }
    ]
  }
]

// Default values for new paper entries
const defaultPaperValues = {
  name: '',
  size: '',
  weight: 0,
  unit_price: 0,
  minimum_order: 1,
  availability: 'available'
}

const PapersPage = () => {
  return (
    <PriceTableContainer
      category='papers'
      title='جدول قیمت کاغذها'
      columns={paperColumns}
      defaultValues={defaultPaperValues}
    />
  )
}

export default PapersPage
