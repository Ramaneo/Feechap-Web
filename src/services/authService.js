import { BaseService } from './BaseService'
import apiClient from '@/libs/apiClient'

/**
 * Authentication service for OTP-based login
 * Extends BaseService for consistent API handling
 */
class AuthService extends BaseService {
  constructor() {
    super('/auth') // Base endpoint for auth-related operations
  }

  /**
   * Request OTP for mobile number
   * @param {string} mobile - 10 digit mobile number
   * @returns {Promise<{token: string, otp?: string, isNewUser: boolean, message: string}>}
   */
  async requestOtp(mobile) {
    const response = await this.post('/send-otp', { mobile }) // POST /auth/send-otp

    return {
      token: response.data.token,
      otp: response.data.otp, // Remove this in production
      isNewUser: response.data.is_new_user,
      message: response.message
    }
  }

  /**
   * Verify OTP and complete authentication
   * @param {string} token - Token received from OTP request
   * @param {string} otp - 6 digit OTP code
   * @returns {Promise<{user: object, token: string, message: string}>}
   */
  async verifyOtp(token, otp) {
    const response = await apiClient.requestWithToken('post', `${this.baseEndpoint}/verify-otp`, token, { otp }) // POST /auth/verify-otp

    // Store the new token for future requests
    apiClient.setAuthToken(response.data.token)

    return {
      user: response.data.user,
      token: response.data.token,
      message: response.message
    }
  }

  /**
   * Get user profile
   * @param {string} token - Authentication token (optional, will use stored token if not provided)
   * @returns {Promise<object>}
   */
  async getProfile(token = null) {
    let response

    if (token) {
      response = await apiClient.requestWithToken('get', this.baseEndpoint, token)
    } else {
      response = await this.get()
    }

    return response.data
  }

  /**
   * Logout user
   * @param {string} token - Authentication token (optional, will use stored token if not provided)
   * @returns {Promise<void>}
   */
  async logout(token = null) {
    try {
      if (token) {
        await apiClient.requestWithToken('delete', this.baseEndpoint, token)
      } else {
        await this.delete()
      }
    } finally {
      // Always clear stored token, even if logout fails
      this.clearAuth()
    }
  }

  /**
   * Check if user is authenticated (has valid token)
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!apiClient.getStoredToken()
  }

  /**
   * Get stored authentication token
   * @returns {string|null}
   */
  getToken() {
    return apiClient.getStoredToken()
  }

  /**
   * Clear authentication data
   */
  clearAuth() {
    apiClient.clearStoredToken()
  }

  /**
   * Set authentication token
   * @param {string} token
   */
  setToken(token) {
    apiClient.setAuthToken(token)
  }
}

export default new AuthService()
