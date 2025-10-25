import apiClient from '@/libs/apiClient'

/**
 * Base service class that other services can extend
 */
export class BaseService {
  constructor(baseEndpoint) {
    this.baseEndpoint = baseEndpoint
    this.apiClient = apiClient
  }

  /**
   * Handle and log errors consistently
   * @protected
   */
  handleError(context, error) {
    console.error(`${context}:`, error)
  }

  /**
   * Format error for consistent error handling
   * @protected
   */
  formatError(error) {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message)
    }

    if (error.response?.data?.errors) {
      // Handle validation errors
      const errors = error.response.data.errors
      const firstError = Object.values(errors)[0]
      return new Error(Array.isArray(firstError) ? firstError[0] : firstError)
    }

    if (error.message) {
      return new Error(error.message)
    }

    return new Error('An unexpected error occurred')
  }

  /**
   * Generic GET request
   * @protected
   */
  async get(endpoint = '', config = {}) {
    try {
      const url = this.baseEndpoint + endpoint
      return await this.apiClient.get(url, config)
    } catch (error) {
      this.handleError(`GET ${this.baseEndpoint}${endpoint}`, error)
      throw this.formatError(error)
    }
  }

  /**
   * Generic POST request
   * @protected
   */
  async post(endpoint = '', data = {}, config = {}) {
    try {
      const url = this.baseEndpoint + endpoint
      return await this.apiClient.post(url, data, config)
    } catch (error) {
      this.handleError(`POST ${this.baseEndpoint}${endpoint}`, error)
      throw this.formatError(error)
    }
  }

  /**
   * Generic PATCH request
   * @protected
   */
  async patch(endpoint = '', data = {}, config = {}) {
    try {
      const url = this.baseEndpoint + endpoint
      return await this.apiClient.patch(url, data, config)
    } catch (error) {
      this.handleError(`PATCH ${this.baseEndpoint}${endpoint}`, error)
      throw this.formatError(error)
    }
  }

  /**
   * Generic PUT request
   * @protected
   */
  async put(endpoint = '', data = {}, config = {}) {
    try {
      const url = this.baseEndpoint + endpoint
      return await this.apiClient.put(url, data, config)
    } catch (error) {
      this.handleError(`PUT ${this.baseEndpoint}${endpoint}`, error)
      throw this.formatError(error)
    }
  }

  /**
   * Generic DELETE request
   * @protected
   */
  async delete(endpoint = '', config = {}) {
    try {
      const url = this.baseEndpoint + endpoint
      return await this.apiClient.delete(url, config)
    } catch (error) {
      this.handleError(`DELETE ${this.baseEndpoint}${endpoint}`, error)
      throw this.formatError(error)
    }
  }

  /**
   * Upload files
   * @protected
   */
  async upload(endpoint = '', formData, config = {}) {
    try {
      const url = this.baseEndpoint + endpoint
      return await this.apiClient.upload(url, formData, config)
    } catch (error) {
      this.handleError(`UPLOAD ${this.baseEndpoint}${endpoint}`, error)
      throw this.formatError(error)
    }
  }
}
