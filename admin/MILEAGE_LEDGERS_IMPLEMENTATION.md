# Mileage Ledgers Implementation

This document explains the implementation of the mileage ledgers feature with API integration and infinite scroll pagination.

## Overview

The mileage ledgers page has been completely refactored to use real API data instead of mock data, implementing infinite scroll pagination similar to the accrual requests page.

## Implementation Details

### 1. Type Definitions (`src/types/mileage-ledger.ts`)

Defined TypeScript interfaces based on the API response structure:

```typescript
interface MileageLedger {
  id: Big;
  customer_id: Big;
  qualifying_miles_delta: number;
  bonus_miles_delta: number;
  accrual_request_id: Big;
  created_at: string;
  updated_at: string;
}
```

### 2. API Service (`src/lib/services/mileage-ledgers.ts`)

Created service for API calls to `/api/v1/admin/miles-ledgers`:

- Supports filtering by `customer_id` and `accrual_request_id`
- Handles pagination parameters (`page` and `size`)
- Uses the existing API client infrastructure

### 3. Infinite Query Hook (`src/lib/hooks/use-mileage-ledgers-infinite.ts`)

Implements infinite scroll pagination using React Query's `useInfiniteQuery`:

- Page size of 20 items for optimal performance
- Automatic data aggregation across pages
- Smart pagination logic with `getNextPageParam`

### 4. UI Component (`src/components/mileage-ledger-item.tsx`)

Created a dedicated component for displaying mileage ledger items:

- Shows customer ID, accrual request ID, and transaction date
- Displays qualifying miles, bonus miles, and total miles
- Uses Vietnamese date formatting
- Consistent styling with the existing design system

### 5. Updated Transactions Page (`src/pages/transactions.tsx`)

Completely refactored to use real API data:

- **Filters**: Customer ID and Accrual Request ID search
- **Infinite Scroll**: Seamless pagination with intersection observer
- **Loading States**: Different indicators for initial load vs. next page
- **Error Handling**: Retry functionality and error display
- **Mobile-First**: Responsive design following project guidelines

### 6. Mock Data (`src/mocks/mileage-ledgers.ts`)

Moved mock data to the mocks folder for development and testing:

- Structured to match the API response format
- Uses Big.js for ID fields to match the backend
- Includes sample data for testing different scenarios

## API Integration

### Endpoint
- **GET** `/api/v1/admin/miles-ledgers`

### Query Parameters
- `customer_id` (optional): Filter by customer ID
- `accrual_request_id` (optional): Filter by accrual request ID
- `page` (optional): Page number for pagination
- `size` (optional): Number of items per page

### Response Format
```json
{
  "data": [
    {
      "id": "245242388946092552",
      "customer_id": "245241128171864584",
      "qualifying_miles_delta": 1442,
      "bonus_miles_delta": 1802,
      "accrual_request_id": "245241133272138248",
      "created_at": "2025-08-20T03:24:14.776354+07:00",
      "updated_at": "2025-08-20T03:24:14.774231+07:00"
    }
  ],
  "total": 3
}
```

## Key Features

### Performance Optimizations
- **Debounced Search**: 700ms debounce for filter inputs
- **Efficient Caching**: React Query handles caching with 2-minute stale time
- **Small Page Size**: 20 items per page for faster loads
- **Smart Loading**: Only loads next page when user approaches bottom

### User Experience
- **Seamless Scrolling**: No pagination controls to interrupt flow
- **Real-time Search**: Instant filtering by customer or request ID
- **Loading Feedback**: Clear indicators for different loading states
- **Error Recovery**: Retry functionality for failed requests

### Mobile-First Design
- **Responsive Layout**: Works well on all screen sizes
- **Touch-Friendly**: Large touch targets and proper spacing
- **Minimal Text**: Concise information display for mobile screens

## Usage

### For Users
1. **Browse Transactions**: Scroll through mileage ledger entries
2. **Search by Customer**: Filter by customer ID
3. **Search by Request**: Filter by accrual request ID
4. **Clear Filters**: Reset all search criteria

### For Developers
1. **Add New Filters**: Extend the query parameters in the service
2. **Modify Display**: Update the `MileageLedgerItem` component
3. **Add Actions**: Implement additional functionality as needed

## Technical Considerations

### Dependencies
- Uses existing React Query setup
- Leverages existing API client infrastructure
- Follows established TypeScript patterns

### Browser Support
- Uses Intersection Observer API (modern browsers)
- Graceful degradation for older browsers

### Performance
- Efficient memory management with React Query
- Optimized re-renders with proper component structure
- Minimal bundle size impact

## Future Enhancements

Potential improvements could include:

- **Export Functionality**: Download transaction history
- **Date Range Filtering**: Filter by transaction date
- **Bulk Operations**: Select and operate on multiple transactions
- **Advanced Analytics**: Charts and statistics
- **Real-time Updates**: WebSocket integration for live data
