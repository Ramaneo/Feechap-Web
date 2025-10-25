import { BaseService } from './BaseService'

/**
 * Cooperator service for managing cooperator data
 */
class CooperatorService extends BaseService {
  constructor() {
    super('/client/offset')
  }

  /**
   * Get cooperators for a specific category
   * @param {string} category - Price category (papers, uvs, cuts, etc.)
   * @returns {Promise<object[]>}
   */
  async getCooperators(category = 'papers') {
    const response = await this.get(`/${category}`)
    return response.data || response
  }

  /**
   * Get all cooperators (defaults to papers category)
   * @returns {Promise<object[]>}
   * @deprecated Use getCooperators(category) instead
   */
  async getAllCooperators() {
    return this.getCooperators('papers')
  }

  /**
   * Get cooperator by ID
   * @param {string|number} cooperatorId
   * @returns {Promise<object>}
   */
  async getCooperator(cooperatorId) {
    const response = await this.get(`/${cooperatorId}`)
    return response.data || response
  }

  /**
   * Create new cooperator
   * @param {object} data - Cooperator data
   * @returns {Promise<object>}
   */
  async createCooperator(data) {
    return await this.post('', data)
  }

  /**
   * Update cooperator
   * @param {string|number} cooperatorId
   * @param {object} data - Updated cooperator data
   * @returns {Promise<object>}
   */
  async updateCooperator(cooperatorId, data) {
    return await this.put(`/${cooperatorId}`, data)
  }

  /**
   * Delete cooperator
   * @param {string|number} cooperatorId
   * @returns {Promise<void>}
   */
  async deleteCooperator(cooperatorId) {
    return await this.delete(`/${cooperatorId}`)
  }
}

export default new CooperatorService()