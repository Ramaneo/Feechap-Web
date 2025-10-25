'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { string, pipe, nonEmpty, regex, object } from 'valibot'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const otpSchema = object({
  otp: pipe(string(), nonEmpty('OTP is required'), regex(/^[0-9]{6}$/, 'Please enter a valid 6-digit OTP'))
})

const OtpVerification = ({
  mobile,
  token,
  onVerificationSuccess,
  onError,
  onBackToMobile,
  onResendOtp,
  testOtp // For development/testing
}) => {
  // States
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(120) // 2 minutes
  const [canResend, setCanResend] = useState(false)

  // Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: valibotResolver(otpSchema),
    defaultValues: {
      otp: ''
    }
  })

  // Timer effect for resend functionality
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000)
      return () => clearTimeout(countdown)
    } else {
      setCanResend(true)
    }
  }, [timer])

  // Auto-fill OTP for development/testing
  useEffect(() => {
    if (testOtp && process.env.NODE_ENV === 'development') {
      setValue('otp', testOtp)
    }
  }, [testOtp, setValue])

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const onSubmit = async data => {
    setIsLoading(true)

    try {
      await onVerificationSuccess(token, data.otp)
    } catch (error) {
      onError(error.message || 'Invalid OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      setIsLoading(true)
      await onResendOtp(mobile)
      setTimer(120)
      setCanResend(false)
    } catch (error) {
      onError(error.message || 'Failed to resend OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box className='flex flex-col gap-4'>
      <div className='flex flex-col gap-1'>
        <Typography variant='h5'>Verify OTP</Typography>
        <Typography variant='body2' color='text.secondary'>
          We've sent a 6-digit OTP to <strong>+91 {mobile}</strong>
        </Typography>
      </div>

      {/* Development/Testing OTP display */}
      {testOtp && process.env.NODE_ENV === 'development' && (
        <Alert severity='info' className='text-sm'>
          <Typography variant='body2'>
            <strong>Development OTP:</strong> {testOtp}
          </Typography>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        <Controller
          name='otp'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              autoFocus
              fullWidth
              label='Enter OTP'
              placeholder='Enter 6-digit OTP'
              type='tel'
              inputProps={{
                maxLength: 6,
                inputMode: 'numeric',
                pattern: '[0-9]*',
                style: { textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.5rem' }
              }}
              {...(errors.otp && {
                error: true,
                helperText: errors.otp.message
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
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </Button>

        <div className='flex flex-col gap-2 items-center'>
          <Typography variant='body2' color='text.secondary'>
            Didn't receive the OTP?
          </Typography>

          {canResend ? (
            <Link
              component='button'
              type='button'
              onClick={handleResendOtp}
              disabled={isLoading}
              className='text-primary'
            >
              Resend OTP
            </Link>
          ) : (
            <Typography variant='body2' color='text.secondary'>
              Resend OTP in {formatTime(timer)}
            </Typography>
          )}

          <Link component='button' type='button' onClick={onBackToMobile} disabled={isLoading} className='text-primary'>
            Change Mobile Number
          </Link>
        </div>
      </form>
    </Box>
  )
}

export default OtpVerification
