/**
 * Global error handler for API responses
 * This can be extended to show toast notifications, modal dialogs, etc.
 */

/**
 * Error types for different handling strategies
 */
export const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  VALIDATION: 'VALIDATION',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT: 'RATE_LIMIT',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN'
}

/**
 * Determine error type based on error object
 */
export function getErrorType(error) {
  if (!error.response) {
    return ERROR_TYPES.NETWORK
  }

  const status = error.response.status

  switch (status) {
    case 401:
      return ERROR_TYPES.AUTHENTICATION
    case 403:
      return ERROR_TYPES.AUTHORIZATION
    case 404:
      return ERROR_TYPES.NOT_FOUND
    case 422:
      return ERROR_TYPES.VALIDATION
    case 429:
      return ERROR_TYPES.RATE_LIMIT
    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_TYPES.SERVER
    default:
      return ERROR_TYPES.UNKNOWN
  }
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error) {
  const errorType = getErrorType(error)

  // First try to get message from response
  if (error.response?.data?.message) {
    return error.response.data.message
  }

  // Handle validation errors
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors
    const firstError = Object.values(errors)[0]
    return Array.isArray(firstError) ? firstError[0] : firstError
  }

  // Fallback to generic messages based on error type
  switch (errorType) {
    case ERROR_TYPES.NETWORK:
      return 'Network error. Please check your internet connection and try again.'
    case ERROR_TYPES.AUTHENTICATION:
      return 'Please log in to continue.'
    case ERROR_TYPES.AUTHORIZATION:
      return 'You do not have permission to perform this action.'
    case ERROR_TYPES.NOT_FOUND:
      return 'The requested resource was not found.'
    case ERROR_TYPES.VALIDATION:
      return 'Please check your input and try again.'
    case ERROR_TYPES.RATE_LIMIT:
      return 'Too many requests. Please wait and try again.'
    case ERROR_TYPES.SERVER:
      return 'Server error. Please try again later.'
    default:
      return 'An unexpected error occurred. Please try again.'
  }
}

/**
 * Handle errors globally with optional custom handling
 */
export function handleGlobalError(error, customHandler = null) {
  const errorType = getErrorType(error)
  const message = getUserFriendlyMessage(error)

  // Log error for debugging
  console.error('Global Error Handler:', {
    type: errorType,
    message,
    originalError: error
  })

  // Call custom handler if provided
  if (customHandler && typeof customHandler === 'function') {
    return customHandler(error, errorType, message)
  }

  // Default handling based on error type
  switch (errorType) {
    case ERROR_TYPES.AUTHENTICATION:
      // Could redirect to login page or show auth modal
      if (typeof window !== 'undefined') {
        // You can uncomment this if you want automatic redirects
        // window.location.href = '/login'
      }
      break

    case ERROR_TYPES.AUTHORIZATION:
      // Could show unauthorized message or redirect to home
      break

    case ERROR_TYPES.NETWORK:
      // Could show connection status indicator
      break

    case ERROR_TYPES.SERVER:
      // Could show maintenance message
      break
  }

  return {
    type: errorType,
    message,
    originalError: error
  }
}

/**
 * Create error notification
 * This can be integrated with your notification system (toast, snackbar, etc.)
 */
export function createErrorNotification(error, options = {}) {
  const { title = 'Error', duration = 5000, showRetry = false, onRetry = null } = options

  const message = getUserFriendlyMessage(error)
  const errorType = getErrorType(error)

  return {
    id: Date.now(),
    type: 'error',
    title,
    message,
    duration,
    errorType,
    showRetry,
    onRetry,
    timestamp: new Date().toISOString()
  }
}

/**
 * Utility to check if error should trigger retry
 */
export function shouldRetry(error) {
  const errorType = getErrorType(error)

  return [ERROR_TYPES.NETWORK, ERROR_TYPES.SERVER, ERROR_TYPES.RATE_LIMIT].includes(errorType)
}

/**
 * Utility to check if error should show in UI
 */
export function shouldShowToUser(error) {
  // Some errors might be too technical or should be handled silently
  const errorType = getErrorType(error)

  // You might want to handle these silently and just log them
  const silentErrors = []

  return !silentErrors.includes(errorType)
}
