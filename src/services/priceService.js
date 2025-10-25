import { BaseService } from './BaseService'

/**
 * Price tables service for managing different price categories
 */
class PriceService extends BaseService {
  constructor() {
    super('/client/offset') // Base endpoint for price tables
  }

  /**
   * Get price table data for specific category and cooperator
   * @param {string} category - Price category (papers, uvs, cuts, etc.)
   * @param {string|number} cooperatorId - Cooperator ID (optional)
   * @param {string|number} rangeId - Circulation range ID (optional, for monitorings)
   * @param {string} boxType - Box type (optional, for boxes)
   * @param {string} binderyType - Bindery type (optional, for binderies)
   * @returns {Promise<object>}
   */
  async getPriceTable(category, cooperatorId = null, rangeId = null, boxType = null, binderyType = null) {
    // Debug: Check if user is authenticated
    if (process.env.NODE_ENV === 'development' && !this.apiClient.isAuthenticated()) {
      console.warn('⚠️ No authentication token found. Make sure user is logged in.')
    }

    // Build query parameters
    const params = {}
    if (cooperatorId) params.cooperator = cooperatorId
    if (rangeId) params.range_id = rangeId
    if (boxType) params.type = boxType
    if (binderyType) params.type = binderyType
    
    return await this.get(`/${category}`, { params })
  }

  /**
   * Get circulation ranges for monitorings
   * @returns {Promise<object[]>}
   */
  async getCirculationRanges() {
    const response = await this.get('/circulation_range')
    return response.data || response
  }

  /**
   * Get box types for boxes category
   * @returns {Promise<object[]>}
   */
  async getBoxTypes() {
    const response = await this.get('/box-types')
    return response.data || response
  }

  /**
   * Get bindery types for binderies category
   * @returns {Promise<object[]>}
   */
  async getBinderyTypes() {
    const response = await this.get('/bindery_types')
    return response.data || response
  }

  /**
   * Create new price entry
   * @param {string} category - Price category
   * @param {object} data - Price entry data
   * @returns {Promise<object>}
   */
  async createPriceEntry(category, data) {
    return await this.post(`/${category}`, data)
  }

  /**
   * Update price entry
   * @param {string} category - Price category
   * @param {string|number} entryId - Price entry ID
   * @param {object} data - Updated price entry data
   * @returns {Promise<object>}
   */
  async updatePriceEntry(category, entryId, data) {
    return await this.put(`/${category}/${entryId}`, data)
  }

  /**
   * Delete price entry
   * @param {string} category - Price category
   * @param {string|number} entryId - Price entry ID
   * @returns {Promise<void>}
   */
  async deletePriceEntry(category, entryId) {
    return await this.delete(`/${category}/${entryId}`)
  }

  /**
   * Bulk update price entries
   * @param {string} category - Price category
   * @param {object[]} entries - Array of price entries to update
   * @returns {Promise<object>}
   */
  async bulkUpdatePrices(category, entries) {
    return await this.put(`/${category}/bulk`, { entries })
  }



  /**
   * Test authentication status
   * @returns {object} Authentication status info
   */
  testAuth() {
    const token = this.apiClient.getStoredToken()
    return {
      isAuthenticated: this.apiClient.isAuthenticated(),
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 10)}...` : null,
      timestamp: new Date().toISOString()
    }
  }
}

export default new PriceService()
