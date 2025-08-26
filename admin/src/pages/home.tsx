import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Filter,
  Search,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccrualRequestTicket } from "@/components/accrual-request-ticket";
import { useAccrualRequestsInfinite, useIntersectionObserver, useDebounce } from "@/lib/hooks";
import type { AccrualRequestQueryParams } from "@/types/accrual-request";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 700);

  // Build query params for API (without page parameter for infinite query)
  const baseQueryParams: Omit<AccrualRequestQueryParams, 'page'> = {
    keyword: debouncedSearchQuery || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    submitted_date: dateFilter || undefined,
  };

  // Use React Query for infinite API calls and state management
  const {
    data,
    isLoading: loading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useAccrualRequestsInfinite(baseQueryParams);

  // Flatten all pages data into a single array
  const requests = data?.pages.flatMap(page => page.data) || [];
  const total = data?.pages[0]?.total || 0;

  // Intersection observer for infinite scroll
  const loadMoreRef = useIntersectionObserver(
    useCallback(() => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]),
    {
      threshold: 0.1,
      rootMargin: '100px', // Start loading 100px before reaching the bottom
    }
  );

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFilter("");
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>{t('home.filters')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm">{t('home.search')}</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder={t('home.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchQuery !== debouncedSearchQuery && (
                <p className="text-xs text-gray-500">{t('home.searching')}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm">{t('home.status')}</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('home.selectStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  <SelectItem value="inprogress">{t('home.inProgress')}</SelectItem>
                  <SelectItem value="approved">{t('home.approved')}</SelectItem>
                  <SelectItem value="rejected">{t('home.rejected')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm">{t('home.submissionDate')}</label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm invisible">Action</label>
              <Button
                variant="outline"
                className="w-full"
                onClick={clearFilters}
              >
                {t('home.clearFilters')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {t('home.showingResults', { count: requests.length, total })}
        </p>
        {loading && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{t('common.loading')}</span>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-red-700 text-sm">
                {t('common.error')}: {error instanceof Error ? error.message : 'An error occurred'}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => refetch()}
                className="text-red-700 border-red-300 hover:bg-red-50"
              >
                {t('common.tryAgain')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((request) => (
          <AccrualRequestTicket key={request.id.toString()} request={request} />
        ))}

        {/* Loading indicator for initial load */}
        {loading && (
          <div className="flex justify-center py-4">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              <span className="text-sm text-gray-500">{t('common.loading')}</span>
            </div>
          </div>
        )}

        {/* Loading indicator for next page */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              <span className="text-sm text-gray-500">{t('common.loadingMore')}</span>
            </div>
          </div>
        )}

        {/* Intersection observer target for infinite scroll */}
        {hasNextPage && (
          <div ref={loadMoreRef} className="h-4" />
        )}

        {/* Empty state */}
        {!loading && requests.length === 0 && !error && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-gray-500">{t('home.noRequestsFound')}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* End of results indicator */}
        {!hasNextPage && requests.length > 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">{t('common.allResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
