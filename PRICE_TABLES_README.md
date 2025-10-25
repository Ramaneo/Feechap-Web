# Price Table CRUD System

## Overview

This implementation provides a comprehensive CRUD system for managing price tables across different printing service categories. Each category has its own dynamic table schema and supports cooperator-based filtering.

## Structure

### Core Components

1. **PriceTableContainer** (`/src/components/prices/PriceTableContainer.jsx`)
   - Main container component for price table management
   - Handles CRUD operations and state management
   - Integrates cooperator selection and data filtering

2. **DynamicPriceTable** (`/src/components/prices/DynamicPriceTable.jsx`)
   - Flexible table component supporting different column types
   - Handles inline editing, row addition/deletion
   - Supports text, number, and select field types

3. **CooperatorSelector** (`/src/components/prices/CooperatorSelector.jsx`)
   - Dropdown component for selecting cooperators
   - Filters price data based on selected cooperator

### Services

1. **PriceService** (`/src/services/priceService.js`)
   - CRUD operations for price entries
   - Schema management for different categories
   - Bulk operations support

2. **CooperatorService** (`/src/services/cooperatorService.js`)
   - Cooperator data management
   - Search and filtering capabilities

### Routing Structure

```
/[lang]/prices/                    # Price categories overview
/[lang]/prices/[category]          # Specific price table (e.g., /en/prices/papers)
```

### Supported Categories

- **papers**: Paper and cardboard pricing
- **uvs**: UV coating pricing
- **cuts**: Cutting services pricing
- **lithographies**: Lithography printing pricing
- **monitorings**: Monitoring and inspection pricing
- **colors**: Offset machine pricing
- **circulations**: Offset circulation pricing
- **selefons**: Cellophane pricing
- **laminates**: Laminate coating pricing
- **boxes**: Box packaging pricing
- **pockets**: Packaging pricing
- **bags**: Bag pricing
- **binderies**: Binding services pricing
- **framings**: Mold making pricing
- **plates**: Plate making pricing
- **golds**: Gold stamping pricing
- **letterpress**: Letterpress printing pricing
- **glues**: Label/sticker pricing
- **numerations**: Numbering services pricing
- **perforages**: Perforation services pricing
- **others**: Miscellaneous services pricing

## Features

### Dynamic Schema Support
Each price category has its own column schema defined by the backend. The frontend dynamically renders tables based on these schemas.

### Field Types
- **text**: Standard text input
- **number**: Numeric input with validation
- **select**: Dropdown selection with predefined options

### CRUD Operations
- **Create**: Add new price entries
- **Read**: Display price data with filtering
- **Update**: Inline editing with bulk save
- **Delete**: Remove price entries

### Cooperator Filtering
All price tables support filtering by cooperator, allowing different pricing structures for different business partners.

## API Integration

The system integrates with PHP Laravel backend endpoints:

```
GET /api/v1/prices/{category}?cooperator_id={id}     # Get price table
POST /api/v1/prices/{category}                       # Create price entry
PUT /api/v1/prices/{category}/{id}                   # Update price entry
DELETE /api/v1/prices/{category}/{id}                # Delete price entry
PUT /api/v1/prices/{category}/bulk                   # Bulk update
GET /api/v1/prices/{category}/schema                 # Get table schema
```

## Usage Example

```jsx
import PriceTableContainer from '@/components/prices/PriceTableContainer'

const PaperPricePage = () => {
  return (
    <PriceTableContainer
      category="papers"
      title="قیمت کاغذ"
      description="مدیریت قیمت انواع کاغذ و مقوا"
    />
  )
}
```

## Navigation Integration

The price tables are integrated into the main navigation menu under "جدول قیمت‌ها" (Price Tables). Each category is accessible through the hierarchical menu structure.

## Error Handling

- Network errors are displayed with user-friendly messages
- Invalid categories show 404 pages
- Loading states provide visual feedback
- Form validation prevents invalid data submission

## Responsive Design

All components are built with responsive design principles using Material-UI components and Tailwind CSS classes.

## Environment Configuration

Ensure your `.env.local` file includes:

```env
NEXT_PUBLIC_API_BASE_URL=http://your-backend-url/api/v1
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```