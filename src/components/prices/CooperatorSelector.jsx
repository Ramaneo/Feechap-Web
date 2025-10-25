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
import { cooperatorService } from '@/services'

const CooperatorSelector = ({ 
  selectedCooperator, 
  onCooperatorChange, 
  category = 'papers',
  label = 'انتخاب همکار' 
}) => {
  const [cooperators, setCooperators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCooperators = async () => {
      try {
        setLoading(true)
        const data = await cooperatorService.getCooperators(category)
        setCooperators(data)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch cooperators:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCooperators()
  }, [category])

  const handleChange = (event) => {
    const value = event.target.value
    onCooperatorChange(value === '' ? null : value)
  }

  if (error) {
    return (
      <Alert severity="error" className="mb-4">
        خطا در بارگذاری لیست همکاران: {error}
      </Alert>
    )
  }

  return (
    <FormControl fullWidth className="mb-4">
      <InputLabel>{label}</InputLabel>
      <Select
        value={selectedCooperator || ''}
        onChange={handleChange}
        label={label}
        disabled={loading}
        endAdornment={loading && <CircularProgress size={20} />}
      >
        <MenuItem value="">
          <em>همه همکاران</em>
        </MenuItem>
        {cooperators.map((cooperator) => (
          <MenuItem key={cooperator.id} value={cooperator.id}>
            {cooperator.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default CooperatorSelector