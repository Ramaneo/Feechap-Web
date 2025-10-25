'use client'

// React Imports
import { useState, useEffect, useCallback } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'

// Component Imports
import CooperatorSelector from './CooperatorSelector'
import CirculationRangeSelector from './CirculationRangeSelector'
import DynamicPriceTable from './DynamicPriceTable'

// Service Imports
import { priceService } from '@/services'

// Helper function to generate schema from actual API data
const generateSchemaFromData = (sampleData, category) => {
  const columns = [
    { key: 'id', label: 'شناسه', type: 'number', editable: false }
  ]

  // Category-specific schemas
  switch (category) {
    case 'papers':
      columns.push(
        { key: 'title', label: 'عنوان', type: 'text', editable: true },
        { key: 'grammage', label: 'گرماژ', type: 'number', editable: true },
        { key: 'quantity', label: 'تعداد', type: 'number', editable: true },
        { key: 'price', label: 'قیمت', type: 'number', editable: true }
      )
      if (sampleData.type) {
        columns.push({ key: 'type.title', label: 'نوع', type: 'text', editable: false })
      }
      if (sampleData.material) {
        columns.push({ key: 'material.title', label: 'جنس', type: 'text', editable: false })
      }
      if (sampleData.dimension) {
        columns.push({ 
          key: 'dimension', 
          label: 'ابعاد', 
          type: 'text', 
          editable: false,
          formatter: (dimension) => dimension ? `${dimension.width} × ${dimension.height}` : '-'
        })
      }
      if (sampleData.measurement) {
        columns.push({ key: 'measurement.title', label: 'واحد اندازه‌گیری', type: 'text', editable: false })
      }
      break

    case 'lithographies':
      if (sampleData.machine) {
        columns.push({ key: 'machine.title', label: 'ماشین', type: 'text', editable: false })
      }
      columns.push(
        { key: 'colored_film', label: 'فیلم رنگی', type: 'number', editable: true },
        { key: 'film', label: 'فیلم', type: 'number', editable: true },
        { key: 'ozalid', label: 'ازالید', type: 'number', editable: true },
        { key: 'zinc', label: 'روی', type: 'number', editable: true },
        { key: 'burned_zinc', label: 'روی سوخته', type: 'number', editable: true },
        { key: 'plate', label: 'پلیت', type: 'number', editable: true },
        { key: 'forming', label: 'قالب‌سازی', type: 'number', editable: true }
      )
      break

    case 'monitorings':
      if (sampleData.level) {
        columns.push({ key: 'level.title', label: 'سطح نظارت', type: 'text', editable: false })
      }
      columns.push(
        { key: 'complex', label: 'پیچیده', type: 'number', editable: true },
        { key: 'medium', label: 'متوسط', type: 'number', editable: true },
        { key: 'simple', label: 'ساده', type: 'number', editable: true }
      )
      break

    case 'colors':
      if (sampleData.machine) {
        columns.push({ key: 'machine.title', label: 'ماشین', type: 'text', editable: false })
      }
      columns.push(
        { key: 'cmyk', label: 'CMYK', type: 'number', editable: true },
        { key: 'spot', label: 'اسپات', type: 'number', editable: true },
        { key: 'metallic', label: 'متالیک', type: 'number', editable: true },
        { key: 'verni', label: 'ورنی', type: 'number', editable: true }
      )
      break

    case 'circulations':
      columns.push(
        { key: 'quantity', label: 'تعداد (از)', type: 'number', editable: true },
        { key: 'to', label: 'تا', type: 'number', editable: true },
        { key: 'cmyk', label: 'CMYK', type: 'number', editable: true },
        { key: 'spot', label: 'اسپات', type: 'number', editable: true },
        { key: 'metallic', label: 'متالیک', type: 'number', editable: true },
        { key: 'verni', label: 'ورنی', type: 'number', editable: true }
      )
      break

    default:
      // Generic schema - dynamically generate from data
      Object.keys(sampleData).forEach(key => {
        // Skip system fields
        if (['id', 'panel_id', 'cooperator_id', 'created_at', 'updated_at', 'deleted_at'].includes(key)) {
          return
        }

        // Handle related objects (e.g., machine, type, material)
        if (typeof sampleData[key] === 'object' && sampleData[key] !== null && !Array.isArray(sampleData[key])) {
          if (sampleData[key].title) {
            columns.push({
              key: `${key}.title`,
              label: key.charAt(0).toUpperCase() + key.slice(1),
              type: 'text',
              editable: false
            })
          }
        } else {
          // Regular fields
          const type = typeof sampleData[key] === 'number' ? 'number' : 'text'
          columns.push({
            key,
            label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            type,
            editable: true
          })
        }
      })
  }

  return columns
}

// Default schema for categories without data
const getDefaultSchema = (category) => {
  switch (category) {
    case 'papers':
      return [
        { key: 'id', label: 'شناسه', type: 'number', editable: false },
        { key: 'title', label: 'عنوان', type: 'text', editable: true },
        { key: 'grammage', label: 'گرماژ', type: 'number', editable: true },
        { key: 'quantity', label: 'تعداد', type: 'number', editable: true },
        { key: 'price', label: 'قیمت', type: 'number', editable: true }
      ]
    case 'lithographies':
      return [
        { key: 'id', label: 'شناسه', type: 'number', editable: false },
        { key: 'colored_film', label: 'فیلم رنگی', type: 'number', editable: true },
        { key: 'film', label: 'فیلم', type: 'number', editable: true },
        { key: 'ozalid', label: 'ازالید', type: 'number', editable: true },
        { key: 'zinc', label: 'روی', type: 'number', editable: true },
        { key: 'burned_zinc', label: 'روی سوخته', type: 'number', editable: true },
        { key: 'plate', label: 'پلیت', type: 'number', editable: true },
        { key: 'forming', label: 'قالب‌سازی', type: 'number', editable: true }
      ]
    case 'monitorings':
      return [
        { key: 'id', label: 'شناسه', type: 'number', editable: false },
        { key: 'complex', label: 'پیچیده', type: 'number', editable: true },
        { key: 'medium', label: 'متوسط', type: 'number', editable: true },
        { key: 'simple', label: 'ساده', type: 'number', editable: true }
      ]
    case 'colors':
      return [
        { key: 'id', label: 'شناسه', type: 'number', editable: false },
        { key: 'cmyk', label: 'CMYK', type: 'number', editable: true },
        { key: 'spot', label: 'اسپات', type: 'number', editable: true },
        { key: 'metallic', label: 'متالیک', type: 'number', editable: true },
        { key: 'verni', label: 'ورنی', type: 'number', editable: true }
      ]
    case 'circulations':
      return [
        { key: 'id', label: 'شناسه', type: 'number', editable: false },
        { key: 'quantity', label: 'تعداد (از)', type: 'number', editable: true },
        { key: 'to', label: 'تا', type: 'number', editable: true },
        { key: 'cmyk', label: 'CMYK', type: 'number', editable: true },
        { key: 'spot', label: 'اسپات', type: 'number', editable: true },
        { key: 'metallic', label: 'متالیک', type: 'number', editable: true },
        { key: 'verni', label: 'ورنی', type: 'number', editable: true }
      ]
    default:
      return [
        { key: 'id', label: 'شناسه', type: 'number', editable: false },
        { key: 'title', label: 'عنوان', type: 'text', editable: true },
        { key: 'price', label: 'قیمت', type: 'number', editable: true }
      ]
  }
}

const PriceTableContainer = ({ 
  category, 
  title, 
  description 
}) => {
  const [selectedCooperator, setSelectedCooperator] = useState(null)
  const [selectedRange, setSelectedRange] = useState(null)
  const [priceData, setPriceData] = useState([])
  const [tableSchema, setTableSchema] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  // Determine if this category needs circulation range selector
  const needsRangeSelector = category === 'monitorings'

  // Fetch price table data
  const fetchPriceData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Debug authentication status
      if (process.env.NODE_ENV === 'development') {
        const authStatus = priceService.testAuth()
        console.log('🔑 Auth Status:', authStatus)
        
        if (!authStatus.isAuthenticated) {
          console.warn('⚠️ User not authenticated - price requests may fail')
        }
      }

      // Fetch price data
      const dataResponse = await priceService.getPriceTable(
        category, 
        selectedCooperator,
        needsRangeSelector ? selectedRange : null
      )
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Price data response:', dataResponse)
      }
      
      const priceEntries = dataResponse.data || dataResponse
      setPriceData(priceEntries)
      
      // Generate schema from the first entry if available
      if (priceEntries && priceEntries.length > 0) {
        const schema = generateSchemaFromData(priceEntries[0], category)
        if (process.env.NODE_ENV === 'development') {
          console.log('📋 Generated schema:', schema)
        }
        setTableSchema(schema)
      } else {
        // Use default schema if no data
        const defaultSchema = getDefaultSchema(category)
        if (process.env.NODE_ENV === 'development') {
          console.log('📋 Using default schema:', defaultSchema)
        }
        setTableSchema(defaultSchema)
      }
    } catch (err) {
      setError(err.message)
      console.error('Failed to fetch price data:', err)
    } finally {
      setLoading(false)
    }
  }, [category, selectedCooperator, selectedRange, needsRangeSelector])

  // Load data when cooperator or range changes
  useEffect(() => {
    fetchPriceData()
  }, [fetchPriceData])

  // Handle price entry updates
  const handleUpdateEntry = async (entryId, updatedData) => {
    try {
      await priceService.updatePriceEntry(category, entryId, updatedData)
      await fetchPriceData() // Refresh data
    } catch (err) {
      setError(`خطا در به‌روزرسانی: ${err.message}`)
    }
  }

  // Handle price entry creation
  const handleCreateEntry = async (newData) => {
    try {
      await priceService.createPriceEntry(category, {
        ...newData,
        cooperator_id: selectedCooperator
      })
      await fetchPriceData() // Refresh data
    } catch (err) {
      setError(`خطا در ایجاد: ${err.message}`)
    }
  }

  // Handle price entry deletion
  const handleDeleteEntry = async (entryId) => {
    try {
      await priceService.deletePriceEntry(category, entryId)
      await fetchPriceData() // Refresh data
    } catch (err) {
      setError(`خطا در حذف: ${err.message}`)
    }
  }

  // Handle bulk save
  const handleBulkSave = async (updatedEntries) => {
    try {
      setLoading(true)
      await priceService.bulkUpdatePrices(category, updatedEntries)
      await fetchPriceData() // Refresh data
      setIsEditing(false)
    } catch (err) {
      setError(`خطا در ذخیره: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader
        title={title}
        subheader={description}
        action={
          <Box className="flex gap-2">
            <Button
              variant={isEditing ? 'outlined' : 'contained'}
              onClick={() => setIsEditing(!isEditing)}
              disabled={loading}
            >
              {isEditing ? 'لغو ویرایش' : 'ویرایش'}
            </Button>
            <IconButton onClick={fetchPriceData} disabled={loading}>
              <i className="tabler-refresh" />
            </IconButton>
          </Box>
        }
      />
      
      <CardContent>
        {/* Cooperator Selector */}
        <CooperatorSelector
          category={category}
          selectedCooperator={selectedCooperator}
          onCooperatorChange={setSelectedCooperator}
        />

        {/* Circulation Range Selector (for monitorings) */}
        {needsRangeSelector && (
          <CirculationRangeSelector
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />
        )}

        {/* Error Display */}
        {error && (
          <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box className="flex justify-center items-center py-8">
            <CircularProgress />
            <Typography className="ml-2">در حال بارگذاری...</Typography>
          </Box>
        )}

        {/* Price Table */}
        {!loading && tableSchema && (
          <DynamicPriceTable
            data={priceData}
            schema={tableSchema}
            isEditing={isEditing}
            onUpdateEntry={handleUpdateEntry}
            onCreateEntry={handleCreateEntry}
            onDeleteEntry={handleDeleteEntry}
            onBulkSave={handleBulkSave}
          />
        )}

        {/* Empty State */}
        {!loading && !error && priceData.length === 0 && (
          <Box className="text-center py-8">
            <Typography variant="h6" color="textSecondary">
              هیچ داده‌ای یافت نشد
            </Typography>
            <Typography variant="body2" color="textSecondary">
              برای همکار انتخاب شده قیمتی ثبت نشده است
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default PriceTableContainer