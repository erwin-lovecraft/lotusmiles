import { useState, useEffect, useCallback, useRef } from 'react';
import type { AccrualRequest, AccrualRequestQueryParams } from '@/types/accrual-request';
import { useAccrualRequestsService } from '@/lib/services';

interface UseInfiniteScrollOptions {
  initialPage?: number;
  pageSize?: number;
  enabled?: boolean;
}

export const useInfiniteScroll = (
  queryParams: Omit<AccrualRequestQueryParams, 'page' | 'size'>,
  options: UseInfiniteScrollOptions = {}
) => {
  const { initialPage = 1, pageSize = 10, enabled = true } = options;
  
  const [data, setData] = useState<AccrualRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [total, setTotal] = useState(0);
  
  const { getAccrualRequests } = useAccrualRequestsService();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const queryParamsRef = useRef(queryParams);

  // Update ref when query params change
  useEffect(() => {
    queryParamsRef.current = queryParams;
  }, [queryParams]);

  const fetchData = useCallback(async (page: number, append: boolean = false) => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAccrualRequests({
        ...queryParamsRef.current,
        page,
        size: pageSize,
      });
      
      if (append) {
        setData(prev => [...prev, ...response.data]);
      } else {
        setData(response.data);
      }
      
      setTotal(response.total);
      setHasMore(response.data.length === pageSize);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [getAccrualRequests, pageSize, enabled]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchData(currentPage + 1, true);
    }
  }, [loading, hasMore, currentPage, fetchData]);

  const refresh = useCallback(() => {
    setData([]);
    setCurrentPage(initialPage);
    setHasMore(true);
    fetchData(initialPage, false);
  }, [initialPage, fetchData]);

  // Set up intersection observer for infinite scroll
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    
    if (node) {
      observerRef.current.observe(node);
    }
  }, [loading, hasMore, loadMore]);

  // Initial load and reset when query params change
  useEffect(() => {
    if (enabled) {
      setData([]);
      setCurrentPage(initialPage);
      setHasMore(true);
      fetchData(initialPage, false);
    }
  }, [enabled, initialPage, fetchData, queryParams.keyword, queryParams.status, queryParams.submitted_date]);

  return {
    data,
    loading,
    error,
    hasMore,
    total,
    currentPage,
    loadMore,
    refresh,
    lastElementRef,
  };
};
