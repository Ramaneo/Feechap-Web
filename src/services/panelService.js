import { BaseService } from './BaseService'

/**
 * Panel management service
 * Example service for your panel-related API endpoints
 */
class PanelService extends BaseService {
  constructor() {
    super('/panels')
  }

  /**
   * Get panel information
   * @param {string|number} panelId
   * @returns {Promise<object>}
   */
  async getPanel(panelId) {
    return await this.get(`/${panelId}`)
  }

  /**
   * Get current user's panel
   * @returns {Promise<object>}
   */
  async getCurrentPanel() {
    return await this.get('/current')
  }

  /**
   * Update panel settings
   * @param {string|number} panelId
   * @param {object} settings
   * @returns {Promise<object>}
   */
  async updatePanelSettings(panelId, settings) {
    return await this.patch(`/${panelId}/settings`, settings)
  }

  /**
   * Get panel pricing
   * @param {string|number} panelId
   * @returns {Promise<object>}
   */
  async getPanelPricing(panelId) {
    return await this.get(`/${panelId}/pricing`)
  }

  /**
   * Update panel pricing
   * @param {string|number} panelId
   * @param {object} pricing
   * @returns {Promise<object>}
   */
  async updatePanelPricing(panelId, pricing) {
    return await this.put(`/${panelId}/pricing`, pricing)
  }

  /**
   * Get panel facture settings
   * @param {string|number} panelId
   * @returns {Promise<object>}
   */
  async getFactureSettings(panelId) {
    return await this.get(`/${panelId}/facture-settings`)
  }

  /**
   * Update panel facture settings
   * @param {string|number} panelId
   * @param {object} settings
   * @returns {Promise<object>}
   */
  async updateFactureSettings(panelId, settings) {
    return await this.put(`/${panelId}/facture-settings`, settings)
  }
}

export default new PanelService()
