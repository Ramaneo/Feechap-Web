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

const BoxTypeSelector = ({ value, onChange, category }) => {
  const [boxTypes, setBoxTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBoxTypes = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await priceService.getBoxTypes()
        setBoxTypes(data || [])
      } catch (err) {
        console.error('Failed to fetch box types:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (category === 'boxes') {
      fetchBoxTypes()
    }
  }, [category])

  if (category !== 'boxes') {
    return null
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={20} />
        <span>در حال بارگذاری انواع جعبه...</span>
      </Box>
    )
  }

  if (error) {
    return <Box sx={{ color: 'error.main' }}>خطا در بارگذاری انواع جعبه: {error}</Box>
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="box-type-select-label">نوع جعبه</InputLabel>
      <Select
        labelId="box-type-select-label"
        id="box-type-select"
        value={value || ''}
        label="نوع جعبه"
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="">
          <em>همه انواع</em>
        </MenuItem>
        {boxTypes.map((boxType) => (
          <MenuItem key={boxType.id} value={boxType.key}>
            {boxType.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default BoxTypeSelector
