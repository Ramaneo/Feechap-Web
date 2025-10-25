import { BaseService } from './BaseService'

/**
 * User management service
 * Example of how to extend BaseService for other endpoints
 */
class UserService extends BaseService {
  constructor() {
    super('/users')
  }

  /**
   * Get list of users with pagination
   * @param {object} params - Query parameters (page, limit, search, etc.)
   * @returns {Promise<object>}
   */
  async getUsers(params = {}) {
    return await this.get('', { params })
  }

  /**
   * Get user by ID
   * @param {string|number} userId
   * @returns {Promise<object>}
   */
  async getUserById(userId) {
    return await this.get(`/${userId}`)
  }

  /**
   * Create new user
   * @param {object} userData
   * @returns {Promise<object>}
   */
  async createUser(userData) {
    return await this.post('', userData)
  }

  /**
   * Update user
   * @param {string|number} userId
   * @param {object} userData
   * @returns {Promise<object>}
   */
  async updateUser(userId, userData) {
    return await this.put(`/${userId}`, userData)
  }

  /**
   * Delete user
   * @param {string|number} userId
   * @returns {Promise<void>}
   */
  async deleteUser(userId) {
    return await this.delete(`/${userId}`)
  }

  /**
   * Update user profile
   * @param {object} profileData
   * @returns {Promise<object>}
   */
  async updateProfile(profileData) {
    return await this.patch('/profile', profileData)
  }

  /**
   * Upload user avatar
   * @param {FormData} formData
   * @returns {Promise<object>}
   */
  async uploadAvatar(formData) {
    return await this.upload('/avatar', formData)
  }

  /**
   * Search users
   * @param {string} query
   * @param {object} filters
   * @returns {Promise<object>}
   */
  async searchUsers(query, filters = {}) {
    const params = { search: query, ...filters }
    return await this.get('/search', { params })
  }
}

export default new UserService()
