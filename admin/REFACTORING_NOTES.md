# Admin Panel Refactoring Notes

## Overview
This document outlines the refactoring changes made to the admin panel to improve code organization, implement API integration, and add infinite scroll pagination.

## Changes Made

### 1. File Structure Reorganization

#### New Files Created:
- `src/types/accrual-request.ts` - TypeScript interfaces for API responses
- `src/mocks/accrual-requests.ts` - Mock data moved from home page
- `src/components/accrual-request-ticket.tsx` - Dedicated component for request tickets
- `src/lib/services/accrual-requests.ts` - API service for accrual requests
- `src/lib/hooks/use-infinite-scroll.ts` - Custom hook for infinite scroll
- `src/lib/hooks/index.ts` - Hook exports
- `src/lib/services/index.ts` - Service exports

#### Files Modified:
- `src/pages/home.tsx` - Completely refactored to use new components and API

### 2. Type Definitions

#### `AccrualRequest` Interface:
```typescript
interface AccrualRequest {
  id: number;
  customer_id: number;
  status: 'pending' | 'inprogress' | 'approved' | 'rejected';
  ticket_id: string;
  pnr: string;
  carrier: string;
  booking_class: string;
  from_code: string;
  to_code: string;
  departure_date: string;
  ticket_image_url: string;
  boarding_pass_image_url: string;
  distance_miles: number;
  qualifying_accrual_rate: number;
  qualifying_miles: number;
  bonus_accrual_rate: number;
  bonus_miles: number;
  reviewer_id: number | null;
  reviewed_at: string | null;
  rejected_reason: string | null;
  created_at: string;
  updated_at: string;
}
```

### 3. Component Refactoring

#### `AccrualRequestTicket` Component:
- Moved all ticket display logic from home page
- Includes `getStatusBadge` and `getVerificationStatusIcon` helper functions
- Handles expandable/collapsible details
- Displays all request information in a structured format
- Supports different status states (pending, inprogress, approved, rejected)

### 4. API Integration

#### Service Layer:
- `useAccrualRequestsService` hook for API calls
- Supports query parameters: keyword, status, submitted_date, page, size
- Uses authenticated API client with Auth0 integration

#### API Endpoint:
```
GET /api/v1/admin/accrual-requests
```

Query Parameters:
- `keyword` - Search term
- `status` - Filter by status
- `submitted_date` - Filter by date
- `page` - Page number for pagination
- `size` - Items per page

### 5. Infinite Scroll Implementation

#### `useInfiniteScroll` Hook:
- Handles pagination automatically
- Uses Intersection Observer for scroll detection
- Manages loading states and error handling
- Supports filtering and search
- Automatically refreshes when filters change

#### Features:
- Automatic loading of next page when scrolling to bottom
- Loading indicators
- Error handling and display
- Empty state handling
- Filter reset functionality

### 6. Home Page Changes

#### Before:
- Used static mock data
- All logic embedded in component
- No API integration
- No pagination

#### After:
- Uses real API data
- Clean separation of concerns
- Infinite scroll pagination
- Proper error handling
- Loading states
- Filter functionality

### 7. Mobile-First Design

The refactored components follow the mobile-first approach:
- Minimized text in forms for mobile
- Large screens supported for easier viewing
- Responsive grid layouts
- Touch-friendly interactions

## Usage

### Basic Usage:
```typescript
import { AccrualRequestTicket } from "@/components/accrual-request-ticket";
import { useInfiniteScroll } from "@/lib/hooks";

// In your component
const { data, loading, error, lastElementRef } = useInfiniteScroll({
  keyword: searchQuery,
  status: statusFilter,
  submitted_date: dateFilter
});
```

### API Response Format:
```json
{
  "data": [
    {
      "id": 245443830797629389,
      "customer_id": 245359322500970765,
      "status": "inprogress",
      "ticket_id": "1234567890111",
      "pnr": "AAA111",
      "carrier": "VN",
      "booking_class": "S",
      "from_code": "CXR",
      "to_code": "HPH",
      "departure_date": "2025-08-21T05:42:51.79Z",
      "ticket_image_url": "https://res.cloudinary.com/...",
      "boarding_pass_image_url": "https://res.cloudinary.com/...",
      "distance_miles": 616,
      "qualifying_accrual_rate": 0.65,
      "qualifying_miles": 400.4,
      "bonus_accrual_rate": 1,
      "bonus_miles": 616,
      "reviewer_id": null,
      "reviewed_at": null,
      "rejected_reason": null,
      "created_at": "2025-08-21T05:45:23.482942Z",
      "updated_at": "2025-08-21T05:45:23.477878Z"
    }
  ],
  "total": 1
}
```

## Benefits

1. **Better Code Organization**: Separated concerns into dedicated files
2. **Reusability**: Components can be reused across the application
3. **Type Safety**: Full TypeScript support with proper interfaces
4. **Performance**: Infinite scroll reduces initial load time
5. **User Experience**: Better loading states and error handling
6. **Maintainability**: Cleaner, more modular code structure
7. **Scalability**: Easy to extend with new features

## Future Enhancements

1. Add sorting functionality
2. Implement bulk actions
3. Add export functionality
4. Real-time updates with WebSocket
5. Advanced filtering options
6. Audit trail functionality
