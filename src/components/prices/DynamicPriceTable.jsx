'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : ''
  }, obj)
}

// Helper function to set nested object values
const setNestedValue = (obj, path, value) => {
  const keys = path.split('.')
  const lastKey = keys.pop()
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {}
    return current[key]
  }, obj)
  target[lastKey] = value
}

const DynamicPriceTable = ({ 
  data, 
  schema, 
  isEditing, 
  onUpdateEntry, 
  onCreateEntry, 
  onDeleteEntry,
  onBulkSave 
}) => {
  const [editedData, setEditedData] = useState([])
  const [newEntry, setNewEntry] = useState({})

  // Initialize edited data when data changes
  useEffect(() => {
    setEditedData(data.map(item => ({ ...item })))
  }, [data])

  // Initialize new entry based on schema
  useEffect(() => {
    if (schema && Array.isArray(schema)) {
      const initialEntry = {}
      schema.forEach(column => {
        if (column.editable !== false) {
          initialEntry[column.key] = column.defaultValue || ''
        }
      })
      setNewEntry(initialEntry)
    }
  }, [schema])

  // Handle cell value change
  const handleCellChange = (rowIndex, columnKey, value) => {
    const updatedData = [...editedData]
    if (columnKey.includes('.')) {
      setNestedValue(updatedData[rowIndex], columnKey, value)
    } else {
      updatedData[rowIndex][columnKey] = value
    }
    setEditedData(updatedData)
  }

  // Handle new entry change
  const handleNewEntryChange = (columnKey, value) => {
    setNewEntry(prev => ({
      ...prev,
      [columnKey]: value
    }))
  }

  // Save all changes
  const handleSaveAll = () => {
    onBulkSave(editedData)
  }

  // Add new entry
  const handleAddEntry = () => {
    onCreateEntry(newEntry)
    // Reset new entry form
    const resetEntry = {}
    schema.forEach(column => {
      if (column.editable !== false) {
        resetEntry[column.key] = column.defaultValue || ''
      }
    })
    setNewEntry(resetEntry)
  }

  // Render cell based on column type
  const renderCell = (column, value, onChange, disabled = false) => {
    switch (column.type) {
      case 'select':
        return (
          <FormControl size="small" fullWidth>
            <Select
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
            >
              {column.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      
      case 'number':
        return (
          <TextField
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            size="small"
            fullWidth
            inputProps={{
              min: column.min,
              max: column.max,
              step: column.step || 1
            }}
          />
        )
      
      case 'text':
      default:
        return (
          <TextField
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            size="small"
            fullWidth
            multiline={column.multiline}
            rows={column.rows || 1}
          />
        )
    }
  }

  // Render display value for read-only mode
  const renderDisplayValue = (column, value, row) => {
    if (typeof column.formatter === 'function') {
      return column.formatter(row[column.key] ?? value, row)
    }
    switch (column.type) {
      case 'select':
        const option = column.options?.find(opt => opt.value === value)
        return option ? (
          <Chip label={option.label} size="small" variant="outlined" />
        ) : value
      
      case 'number':
        return column.suffix ? `${value} ${column.suffix}` : value
      
      default:
        return value
    }
  }

  if (!schema || !Array.isArray(schema) || schema.length === 0) {
    return <div>در حال بارگذاری...</div>
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {schema.map((column) => (
                <TableCell key={column.key}>
                  {column.label}
                  {column.required && <span className="text-red-500 ml-1">*</span>}
                </TableCell>
              ))}
              {isEditing && <TableCell>عملیات</TableCell>}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {/* Existing Data Rows */}
            {editedData.map((row, rowIndex) => (
              <TableRow key={row.id || rowIndex}>
                {schema.map((column) => (
                  <TableCell key={column.key}>
                    {isEditing && column.editable !== false ? (
                      renderCell(
                        column,
                        getNestedValue(row, column.key),
                        (value) => handleCellChange(rowIndex, column.key, value)
                      )
                    ) : (
                      renderDisplayValue(column, getNestedValue(row, column.key), row)
                    )}
                  </TableCell>
                ))}
                {isEditing && (
                  <TableCell>
                    <IconButton
                      onClick={() => onDeleteEntry(row.id)}
                      color="error"
                      size="small"
                    >
                      <i className="tabler-trash" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}

            {/* New Entry Row */}
            {isEditing && (
              <TableRow>
                {schema.map((column) => (
                  <TableCell key={column.key}>
                    {column.editable !== false ? (
                      renderCell(
                        column,
                        newEntry[column.key],
                        (value) => handleNewEntryChange(column.key, value)
                      )
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton
                    onClick={handleAddEntry}
                    color="primary"
                    size="small"
                  >
                    <i className="tabler-plus" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Save Actions */}
      {isEditing && (
        <Box className="mt-4 flex justify-end gap-2">
          <Button variant="contained" onClick={handleSaveAll}>
            ذخیره همه تغییرات
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default DynamicPriceTable