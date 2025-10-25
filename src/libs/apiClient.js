import axios from 'axios'

import { handleGlobalError, getUserFriendlyMessage } from './errorHandler'

/**
 * Base API client configuration
 */
class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    this.setupInterceptors()
  }

  /**
   * Setup request and response interceptors
   */
  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      config => {
        // Add auth token to requests if available
        if (typeof window !== 'undefined') {
          const token = this.getStoredToken()
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
            
            // Debug: Show token usage
            if (process.env.NODE_ENV === 'development') {
              console.log(`🔑 Using token: ${token.substring(0, 10)}... for ${config.method?.toUpperCase()} ${config.url}`)
            }
          } else if (process.env.NODE_ENV === 'development') {
            console.warn(`⚠️ No token found for ${config.method?.toUpperCase()} ${config.url}`)
          }
        }

        // Log request in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            params: config.params,
            data: config.data
          })
        }

        return config
      },
      error => {
        console.error('API Request Error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      response => {
        // Log response in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data
          })
        }

        return response
      },
      error => {
        // Use global error handler
        const handledError = handleGlobalError(error)

        // Still return the rejected promise so calling code can handle it
        return Promise.reject(error)
      }
    )
  }

  /**
   * Handle response errors globally
   */
  handleResponseError(error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data
      })
    }

    // Handle different error types
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // Unauthorized - clear stored token and redirect to login if needed
          this.clearStoredToken()
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            // Optional: redirect to login page
            // window.location.href = '/login'
          }
          break
        case 403:
          // Forbidden
          console.warn('Access forbidden:', data?.message)
          break
        case 404:
          // Not found
          console.warn('Resource not found:', error.config?.url)
          break
        case 422:
          // Validation errors
          console.warn('Validation error:', data?.errors || data?.message)
          break
        case 429:
          // Rate limiting
          console.warn('Rate limit exceeded')
          break
        case 500:
          // Server error
          console.error('Server error:', data?.message)
          break
        default:
          console.error('Unexpected error:', data?.message || 'Unknown error')
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message)
    } else {
      // Something else
      console.error('Request setup error:', error.message)
    }
  }

  /**
   * Store authentication token (you can customize storage method)
   */
  setAuthToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  /**
   * Get stored authentication token
   */
  getStoredToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getStoredToken()
  }

  /**
   * Set authentication token
   */
  setAuthToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  /**
   * Clear stored authentication token
   */
  clearStoredToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  /**
   * Make GET request
   */
  async get(url, config = {}) {
    const response = await this.client.get(url, config)
    return response.data
  }

  /**
   * Make POST request
   */
  async post(url, data = {}, config = {}) {
    const response = await this.client.post(url, data, config)
    return response.data
  }

  /**
   * Make PATCH request
   */
  async patch(url, data = {}, config = {}) {
    const response = await this.client.patch(url, data, config)
    return response.data
  }

  /**
   * Make PUT request
   */
  async put(url, data = {}, config = {}) {
    const response = await this.client.put(url, data, config)
    return response.data
  }

  /**
   * Make DELETE request
   */
  async delete(url, config = {}) {
    const response = await this.client.delete(url, config)
    return response.data
  }

  /**
   * Upload file(s)
   */
  async upload(url, formData, config = {}) {
    const uploadConfig = {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data'
      }
    }

    const response = await this.client.post(url, formData, uploadConfig)
    return response.data
  }

  /**
   * Make request with custom token (for temporary authentication)
   */
  async requestWithToken(method, url, token, data = {}, config = {}) {
    const tokenConfig = {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`
      }
    }

    const response = await this.client[method](
      url,
      method === 'get' || method === 'delete' ? tokenConfig : data,
      method === 'get' || method === 'delete' ? undefined : tokenConfig
    )
    return response.data
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient()

export default apiClient
