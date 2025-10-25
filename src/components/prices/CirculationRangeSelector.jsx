'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Service Imports
import { priceService } from '@/services'

const CirculationRangeSelector = ({ 
  selectedRange, 
  onRangeChange, 
  label = 'انتخاب محدوده تیراژ' 
}) => {
  const [ranges, setRanges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRanges = async () => {
      try {
        setLoading(true)
        const data = await priceService.getCirculationRanges()
        setRanges(data)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch circulation ranges:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRanges()
  }, [])

  const handleChange = (event) => {
    const value = event.target.value
    onRangeChange(value === '' ? null : value)
  }

  if (error) {
    return (
      <Alert severity="error" className="mb-4">
        خطا در بارگذاری لیست محدوده تیراژ: {error}
      </Alert>
    )
  }

  return (
    <FormControl fullWidth className="mb-4">
      <InputLabel id="circulation-range-selector-label">{label}</InputLabel>
      <Select
        labelId="circulation-range-selector-label"
        id="circulation-range-selector"
        value={selectedRange || ''}
        label={label}
        onChange={handleChange}
        disabled={loading}
        startAdornment={loading ? <CircularProgress size={20} className="mr-2" /> : null}
      >
        <MenuItem value="">
          <em>همه محدوده‌ها</em>
        </MenuItem>
        {ranges.map((range) => (
          <MenuItem key={range.id} value={range.id}>
            {range.from.toLocaleString('fa-IR')} - {range.to.toLocaleString('fa-IR')}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default CirculationRangeSelector
