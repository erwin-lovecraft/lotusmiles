# Optimistic Updates Implementation

This document explains the optimistic updates implementation for accrual request approve/reject actions, providing immediate UI feedback without waiting for server responses.

## Overview

The accrual request actions (approve/reject) now use optimistic updates to provide instant visual feedback to users. When an admin clicks approve or reject, the UI immediately updates to show the new status, while the actual API request happens in the background.

## Implementation Details

### 1. Optimistic Update Flow

The implementation follows this sequence:

1. **User Action**: Admin clicks approve/reject button
2. **Optimistic Update**: UI immediately shows the new status
3. **API Request**: Background API call is made
4. **Success**: Toast notification confirms success
5. **Error**: UI reverts to previous state if API fails
6. **Sync**: Data is refetched to ensure consistency

### 2. Updated Action Hooks

#### `useApproveAccrualRequest`

```typescript
onMutate: async (id) => {
  // Cancel outgoing refetches
  await queryClient.cancelQueries({ queryKey: ['accrual-requests'] });
  await queryClient.cancelQueries({ queryKey: ['accrual-requests-infinite'] });

  // Snapshot previous state
  const previousAccrualRequests = queryClient.getQueryData(['accrual-requests']);
  const previousAccrualRequestsInfinite = queryClient.getQueryData(['accrual-requests-infinite']);

  // Optimistically update both regular and infinite queries
  queryClient.setQueryData(['accrual-requests'], (old) => {
    // Update the specific request status to 'approved'
  });

  queryClient.setQueryData(['accrual-requests-infinite'], (old) => {
    // Update the specific request in all pages
  });

  return { previousAccrualRequests, previousAccrualRequestsInfinite };
}
```

#### `useRejectAccrualRequest`

Similar implementation but updates status to 'rejected' and includes the rejection reason.

### 3. Error Handling

If the API request fails:

```typescript
onError: (err, _id, context) => {
  // Revert to previous state
  if (context?.previousAccrualRequests) {
    queryClient.setQueryData(['accrual-requests'], context.previousAccrualRequests);
  }
  if (context?.previousAccrualRequestsInfinite) {
    queryClient.setQueryData(['accrual-requests-infinite'], context.previousAccrualRequestsInfinite);
  }
  // Show error toast
  toast.error('Không thể phê duyệt yêu cầu. Vui lòng thử lại.');
}
```

### 4. Data Synchronization

After each action (success or error):

```typescript
onSettled: () => {
  // Refetch to ensure data consistency
  queryClient.invalidateQueries({ queryKey: ['accrual-requests'] });
  queryClient.invalidateQueries({ queryKey: ['accrual-requests-infinite'] });
}
```

## Key Benefits

### 1. Immediate User Feedback
- Users see instant status changes
- No waiting for network requests
- Improved perceived performance

### 2. Better User Experience
- Responsive interface
- Clear visual feedback
- Reduced user frustration

### 3. Robust Error Handling
- Automatic rollback on failure
- Clear error messages
- Data consistency maintained

### 4. Data Integrity
- Background synchronization
- Fallback to server state
- No data loss scenarios

## Technical Implementation

### Query Cache Management

The implementation handles both types of queries:

1. **Regular Queries** (`['accrual-requests']`): For single-page data
2. **Infinite Queries** (`['accrual-requests-infinite']`): For paginated data

### State Updates

For each query type, the implementation:

1. **Locates the target request** by ID
2. **Updates the status** to 'approved' or 'rejected'
3. **Adds metadata** like reviewer_id, reviewed_at, rejected_reason
4. **Preserves other data** unchanged

### Type Safety

- Full TypeScript support
- Proper type checking for status changes
- Safe access to nested data structures

## User Experience Flow

### Approve Action
1. User clicks "Phê duyệt" button
2. Button shows loading state
3. Request status immediately changes to "Đã duyệt"
4. Action buttons disappear (no longer needed)
5. Success toast appears
6. Data syncs in background

### Reject Action
1. User clicks "Từ chối" button
2. Rejection dialog opens
3. User enters rejection reason
4. Button shows loading state
5. Request status immediately changes to "Từ chối"
6. Rejection reason appears in UI
7. Success toast appears
8. Data syncs in background

### Error Scenarios
1. User clicks action button
2. UI optimistically updates
3. API request fails
4. UI reverts to previous state
5. Error toast appears
6. User can retry the action

## Performance Considerations

### Memory Usage
- Minimal memory overhead
- Efficient cache updates
- Automatic cleanup

### Network Efficiency
- No unnecessary refetches during optimistic updates
- Background synchronization
- Smart cache invalidation

### Bundle Size
- No additional dependencies
- Uses existing React Query features
- Minimal code footprint

## Future Enhancements

Potential improvements could include:

- **Real-time Updates**: WebSocket integration for live status changes
- **Batch Operations**: Optimistic updates for multiple requests
- **Undo Functionality**: Allow users to undo recent actions
- **Offline Support**: Queue actions when offline
- **Advanced Analytics**: Track action success rates and timing

## Testing Considerations

### Unit Tests
- Test optimistic update logic
- Test error rollback scenarios
- Test data consistency

### Integration Tests
- Test API integration
- Test cache synchronization
- Test user interaction flows

### User Acceptance Tests
- Test immediate feedback
- Test error handling
- Test data consistency after actions
