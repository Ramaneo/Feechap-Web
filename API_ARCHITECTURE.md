# API Service Architecture Documentation

This document explains how to use the new API service architecture in your Next.js project.

## 🏗️ Architecture Overview

The API architecture consists of:

1. **ApiClient** (`src/libs/apiClient.js`) - Base Axios client with interceptors
2. **BaseService** (`src/services/BaseService.js`) - Base class for all API services
3. **Service Classes** (`src/services/`) - Specific services extending BaseService
4. **Error Handler** (`src/libs/errorHandler.js`) - Global error handling utilities

## 🚀 Quick Start

### Using Existing Services

```javascript
// Import services
import { authService, userService, panelService } from '@/services'

// Or import individual services
import authService from '@/services/authService'

// Use the services
try {
  const result = await authService.requestOtp('1234567890')
  console.log(result)
} catch (error) {
  console.error(error.message)
}
```

### Authentication Flow Example

```javascript
import { authService } from '@/services'

// Step 1: Request OTP
const otpResult = await authService.requestOtp('1234567890')
console.log('OTP sent:', otpResult.message)

// Step 2: Verify OTP
const authResult = await authService.verifyOtp(otpResult.token, '123456')
console.log('User:', authResult.user)

// Step 3: Use authenticated requests
const profile = await authService.getProfile()
console.log('Profile:', profile)
```

## 📝 Creating New Services

### Step 1: Create Service Class

```javascript
// src/services/orderService.js
import { BaseService } from './BaseService'

class OrderService extends BaseService {
  constructor() {
    super('/orders') // Base endpoint
  }

  // Get all orders
  async getOrders(params = {}) {
    return await this.get('', { params })
  }

  // Get order by ID
  async getOrder(orderId) {
    return await this.get(`/${orderId}`)
  }

  // Create new order
  async createOrder(orderData) {
    return await this.post('', orderData)
  }

  // Update order
  async updateOrder(orderId, orderData) {
    return await this.put(`/${orderId}`, orderData)
  }

  // Cancel order
  async cancelOrder(orderId) {
    return await this.patch(`/${orderId}/cancel`)
  }

  // Delete order
  async deleteOrder(orderId) {
    return await this.delete(`/${orderId}`)
  }

  // Upload order attachment
  async uploadAttachment(orderId, formData) {
    return await this.upload(`/${orderId}/attachment`, formData)
  }

  // Custom method example
  async getOrdersByStatus(status) {
    return await this.get(`/by-status/${status}`)
  }
}

export default new OrderService()
```

### Step 2: Add to Service Index

```javascript
// src/services/index.js
import orderService from './orderService'

export {
  authService,
  userService,
  panelService,
  orderService // Add your new service
}

export default {
  auth: authService,
  user: userService,
  panel: panelService,
  order: orderService // Add your new service
}
```

### Step 3: Use Your New Service

```javascript
import { orderService } from '@/services'

// Get orders with pagination
const orders = await orderService.getOrders({ page: 1, limit: 10 })

// Create new order
const newOrder = await orderService.createOrder({
  product_id: 1,
  quantity: 2,
  notes: 'Special delivery'
})

// Upload attachment
const formData = new FormData()
formData.append('file', file)
const attachment = await orderService.uploadAttachment(newOrder.id, formData)
```

## 🛠️ Available Methods in BaseService

All services automatically inherit these methods:

- `get(endpoint, config)` - GET request
- `post(endpoint, data, config)` - POST request
- `patch(endpoint, data, config)` - PATCH request
- `put(endpoint, data, config)` - PUT request
- `delete(endpoint, config)` - DELETE request
- `upload(endpoint, formData, config)` - File upload

## 🔧 Configuration

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### API Client Configuration

The API client automatically handles:

- Authentication tokens
- Request/response logging (development)
- Error handling
- Response transformation

## ⚡ Advanced Usage

### Custom Headers

```javascript
// For a specific request
const data = await userService.get('/profile', {
  headers: {
    'X-Custom-Header': 'value'
  }
})

// For all requests (add to service constructor)
class CustomService extends BaseService {
  constructor() {
    super('/custom')
    this.apiClient.client.defaults.headers['X-Custom-Header'] = 'value'
  }
}
```

### Request with Custom Token

```javascript
import apiClient from '@/libs/apiClient'

// Use temporary token without storing it
const response = await apiClient.requestWithToken('get', '/protected-endpoint', 'temporary-token')
```

### File Upload Example

```javascript
const uploadFile = async file => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', 'document')

  return await userService.upload('/documents', formData)
}
```

### Error Handling

```javascript
import { getUserFriendlyMessage, getErrorType } from '@/libs/errorHandler'

try {
  const result = await userService.createUser(userData)
} catch (error) {
  const message = getUserFriendlyMessage(error)
  const type = getErrorType(error)

  // Show user-friendly message
  console.error(message)

  // Handle based on error type
  if (type === 'VALIDATION') {
    // Show validation errors
  } else if (type === 'AUTHENTICATION') {
    // Redirect to login
  }
}
```

## 📱 React Hook Examples

### Custom Hook for API Calls

```javascript
// hooks/useApi.js
import { useState, useEffect } from 'react'

export function useApi(serviceMethod, dependencies = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await serviceMethod()
        setData(result)
        setError(null)
      } catch (err) {
        setError(err.message)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, dependencies)

  return { data, loading, error }
}

// Usage
function UserProfile() {
  const { data: profile, loading, error } = useApi(() => userService.getProfile())

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!profile) return <div>No profile data</div>

  return <div>Welcome, {profile.name}!</div>
}
```

### Custom Hook for Mutations

```javascript
// hooks/useMutation.js
import { useState } from 'react'

export function useMutation(mutationFn) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const result = await mutationFn(...args)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading, error }
}

// Usage
function CreateUserForm() {
  const { mutate: createUser, loading, error } = useMutation(userService.createUser)

  const handleSubmit = async userData => {
    try {
      const newUser = await createUser(userData)
      console.log('User created:', newUser)
    } catch (error) {
      console.error('Failed to create user:', error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type='submit' disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
      {error && <div className='error'>{error}</div>}
    </form>
  )
}
```

## 🔒 Authentication Integration

The API client automatically:

1. Stores authentication tokens in localStorage
2. Adds tokens to all requests
3. Handles token expiration
4. Clears tokens on logout

### Manual Token Management

```javascript
import apiClient from '@/libs/apiClient'

// Set token manually
apiClient.setAuthToken('your-token-here')

// Get current token
const token = apiClient.getStoredToken()

// Clear token
apiClient.clearStoredToken()

// Check if authenticated
const isAuthenticated = !!apiClient.getStoredToken()
```

## 🚦 Best Practices

1. **Always use try-catch blocks** when calling API methods
2. **Use the service layer** instead of calling apiClient directly
3. **Create custom hooks** for complex API interactions
4. **Handle loading states** in your components
5. **Use the error handler utilities** for consistent error messages
6. **Extend BaseService** for new API endpoints
7. **Group related endpoints** in the same service class

## 🔍 Debugging

### Enable Development Logging

The API client automatically logs requests and responses in development mode. Check your browser console for:

- 🚀 Request logs
- ✅ Successful response logs
- ❌ Error logs

### Common Issues

1. **CORS errors**: Make sure your PHP backend allows your frontend domain
2. **401 errors**: Check if your authentication token is valid
3. **422 errors**: Validation errors from your backend
4. **Network errors**: Check if your API_URL is correct

This architecture provides a solid foundation for all your API interactions while being easily extensible for future needs!
