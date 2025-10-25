'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

// Service Imports
import { priceService } from '@/services'

const BinderyTypeSelector = ({ value, onChange, category }) => {
  const [binderyTypes, setBinderyTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBinderyTypes = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await priceService.getBinderyTypes()
        setBinderyTypes(data || [])
      } catch (err) {
        console.error('Failed to fetch bindery types:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (category === 'binderies') {
      fetchBinderyTypes()
    }
  }, [category])

  if (category !== 'binderies') {
    return null
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={20} />
        <span>در حال بارگذاری انواع صحافی...</span>
      </Box>
    )
  }

  if (error) {
    return <Box sx={{ color: 'error.main' }}>خطا در بارگذاری انواع صحافی: {error}</Box>
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="bindery-type-select-label">نوع صحافی</InputLabel>
      <Select
        labelId="bindery-type-select-label"
        id="bindery-type-select"
        value={value || ''}
        label="نوع صحافی"
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="">
          <em>همه انواع</em>
        </MenuItem>
        {binderyTypes.map((binderyType) => (
          <MenuItem key={binderyType.id} value={binderyType.key}>
            {binderyType.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default BinderyTypeSelector
