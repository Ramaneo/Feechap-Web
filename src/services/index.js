/**
 * Centralized export of all API services
 * This makes it easy to import any service from a single location
 */

// Import all services
import authService from './authService'
import userService from './userService'
import panelService from './panelService'
import priceService from './priceService'
import cooperatorService from './cooperatorService'

// You can add more services here as you create them
// import orderService from './orderService'
// import productService from './productService'
// import notificationService from './notificationService'

// Export all services
export {
  authService,
  userService,
  panelService,
  priceService,
  cooperatorService
}

// Default export for convenience
export default {
  auth: authService,
  user: userService,
  panel: panelService,
  price: priceService,
  cooperator: cooperatorService
}

/*
Usage examples:

// Named imports
import { authService, userService } from '@/services'

// Default import
import services from '@/services'
services.auth.requestOtp('1234567890')
services.user.getUsers()
services.panel.getCurrentPanel()

// Individual service import
import authService from '@/services/authService'
*/
