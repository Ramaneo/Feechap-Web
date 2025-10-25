'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { string, pipe, nonEmpty, regex, object } from 'valibot'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Service Imports
import { authService } from '@/services'

const mobileSchema = object({
  mobile: pipe(
    string(),
    nonEmpty('Mobile number is required'),
    regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number')
  )
})

const MobileInput = ({ onOtpSent, onError }) => {
  // States
  const [isLoading, setIsLoading] = useState(false)

  // Hooks
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(mobileSchema),
    defaultValues: {
      mobile: ''
    }
  })

  const onSubmit = async data => {
    setIsLoading(true)

    try {
      const result = await authService.requestOtp(data.mobile)

      onOtpSent({
        mobile: data.mobile,
        token: result.token,
        otp: result.otp, // For development/testing
        isNewUser: result.isNewUser,
        message: result.message
      })
    } catch (error) {
      onError(error.message || 'Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box className='flex flex-col gap-4'>
      <div className='flex flex-col gap-1'>
        <Typography variant='h5'>Enter Mobile Number</Typography>
        <Typography variant='body2' color='text.secondary'>
          We'll send you an OTP to verify your mobile number
        </Typography>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        <Controller
          name='mobile'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              autoFocus
              fullWidth
              label='Mobile Number'
              placeholder='Enter 10-digit mobile number'
              type='tel'
              inputProps={{
                maxLength: 10,
                inputMode: 'numeric',
                pattern: '[0-9]*'
              }}
              {...(errors.mobile && {
                error: true,
                helperText: errors.mobile.message
              })}
            />
          )}
        />

        <Button
          fullWidth
          variant='contained'
          type='submit'
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? 'Sending OTP...' : 'Send OTP'}
        </Button>
      </form>
    </Box>
  )
}

export default MobileInput
