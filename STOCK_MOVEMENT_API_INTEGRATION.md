# Stock Movement API Integration

## Overview
The `InventoryStockMovementBody` component has been updated to fetch stock movement data dynamically from the API instead of using static data.

## API Endpoint
- **URL**: `GET /stock-movement`
- **Base URL**: Configured in `src/config/config.js` via `REACT_APP_API_URL` environment variable

## API Response Format
```json
{
  "message": "Stock movements fetched successfully",
  "data": [
    {
      "stone_code": "DICSV-00",
      "lot_no": "LOT001",
      "stone": "Diamond",
      "shape": "Round",
      "size": "1.0",
      "color": "D",
      "cutting": "Excellent",
      "quality": "VVS1",
      "clarity": "VS1",
      "in_pcs": 160,
      "in_weight": 6,
      "out_pcs": 22,
      "out_weight": 6,
      "balance_pcs": 138,
      "balance_weight": 0
    }
  ]
}
```

## Features Implemented

### 1. Dynamic Data Fetching
- Component fetches data from API on mount
- Loading state with spinner
- Error handling with user-friendly messages

### 2. Search Functionality
- Real-time search across all fields:
  - Stone Code
  - Lot Number
  - Stone Type
  - Shape
  - Color
  - Cutting
  - Quality
  - Clarity

### 3. Date Range Selection
- Start and end date pickers
- Uses dayjs for date handling
- Format: DD/MM/YYYY

### 4. Data Display
- Dynamic table rows based on API response
- Empty state handling
- Summary showing total items and filtered results

### 5. Service Layer
- Created `src/services/stockMovementService.js`
- Uses axios for HTTP requests
- Centralized API configuration

### 6. Detail View with Dynamic Data
- Click any row to view detailed information
- Fetches data from `/stock-movement/{stone_code}` API endpoint
- Shows summary with stock cost, value, and profit
- Displays detailed movements table with all transaction data
- Back navigation to return to the main list

## Component Structure

### State Variables
- `stockMovements`: Raw data from API
- `filteredStockMovements`: Filtered data for display
- `loading`: Loading state
- `error`: Error state
- `searchTerm`: Search input value
- `startDate`/`endDate`: Date range values
- `rowPP`: Rows per page setting

### Key Functions
- `fetchStockMovements()`: Fetches data from API
- `useEffect` hooks for data fetching and filtering

## Usage

### Environment Setup
Set the API base URL in your `.env` file:
```env
REACT_APP_API_URL=http://your-api-domain.com
```

### Component Import
```jsx
import InventoryStockMovementBody from './component/Inventory/InventoryStockMovementBody';
```

### Basic Usage
```jsx
<InventoryStockMovementBody />
```

## Styling
- Uses Material-UI components
- Consistent with existing design system
- Responsive layout
- Custom scrollbar styling

## Error Handling
- Network errors
- API response errors
- Empty data states
- User-friendly error messages

## Future Enhancements
- Date range filtering implementation
- Pagination support
- Export functionality
- Advanced filtering options
- Real-time updates
