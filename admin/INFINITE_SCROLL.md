# Infinite Scroll Implementation

This document explains the infinite scroll pagination implementation for the accrual requests list.

## Overview

The infinite scroll feature allows users to continuously scroll through accrual requests without traditional pagination controls. As the user scrolls near the bottom of the list, new data is automatically loaded.

## Implementation Details

### 1. Infinite Query Hook (`useAccrualRequestsInfinite`)

Located in `src/lib/hooks/use-accrual-requests-infinite.ts`:

- Uses React Query's `useInfiniteQuery` for efficient data fetching and caching
- Automatically manages page state and data aggregation
- Implements `getNextPageParam` to determine when more data is available
- Uses a page size of 20 items for optimal performance

### 2. Intersection Observer Hook (`useIntersectionObserver`)

Located in `src/lib/hooks/use-intersection-observer.ts`:

- Custom hook that uses the Intersection Observer API
- Detects when a target element comes into view
- Configurable threshold and root margin for precise control
- Automatically handles cleanup and re-initialization

### 3. Home Page Integration

The home page (`src/pages/home.tsx`) integrates both hooks:

- **Data Management**: Uses `useAccrualRequestsInfinite` to fetch and manage data
- **Scroll Detection**: Uses `useIntersectionObserver` to detect when to load more
- **Loading States**: Shows different loading indicators for initial load vs. next page load
- **Error Handling**: Maintains existing error handling with retry functionality

## Key Features

### Performance Optimizations

- **Debounced Search**: Search queries are debounced to prevent excessive API calls
- **Efficient Caching**: React Query handles caching with configurable stale times
- **Small Page Size**: 20 items per page for faster initial loads
- **Smart Loading**: Only loads next page when user approaches the bottom

### User Experience

- **Seamless Scrolling**: No pagination controls to interrupt the flow
- **Loading Indicators**: Clear feedback when loading more data
- **End State**: Shows when all results have been loaded
- **Filter Integration**: Works seamlessly with existing search and filter functionality

### Error Handling

- **Retry Mechanism**: Users can retry failed requests
- **Graceful Degradation**: Shows error messages without breaking the UI
- **State Preservation**: Maintains loaded data even if new requests fail

## Usage

The infinite scroll is automatically active on the home page. Users can:

1. **Scroll normally** through the list of accrual requests
2. **Use filters** to search and filter results (triggers new infinite query)
3. **See loading indicators** when more data is being fetched
4. **Get feedback** when all results have been loaded

## Technical Considerations

### API Requirements

The backend API must support:
- Pagination parameters (`page` and `size`)
- Total count in response for calculating remaining pages
- Consistent response format across pages

### Browser Support

- Uses Intersection Observer API (supported in all modern browsers)
- Gracefully degrades if not supported (though unlikely in admin panel context)

### Memory Management

- React Query automatically manages cache size and cleanup
- Old pages are garbage collected after 5 minutes
- Data is considered stale after 2 minutes

## Future Enhancements

Potential improvements could include:

- **Virtual Scrolling**: For very large datasets (1000+ items)
- **Prefetching**: Load next page before user reaches bottom
- **Search Highlighting**: Highlight search terms in results
- **Export Functionality**: Export all filtered results
- **Bulk Operations**: Select and operate on multiple items
