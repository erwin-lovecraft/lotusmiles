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

export default function HomePage() {
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
            <span>Bộ lọc</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm">Tìm kiếm</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Ticket ID, keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchQuery !== debouncedSearchQuery && (
                <p className="text-xs text-gray-500">Đang tìm kiếm...</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm">Trạng thái</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="inprogress">Đang xử lý</SelectItem>
                  <SelectItem value="approved">Đã duyệt</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm">Ngày gửi</label>
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
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Hiển thị {requests.length} trong tổng số {total} yêu cầu
        </p>
        {loading && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang tải...</span>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-red-700 text-sm">
                Lỗi: {error instanceof Error ? error.message : 'An error occurred'}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => refetch()}
                className="text-red-700 border-red-300 hover:bg-red-50"
              >
                Thử lại
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
              <span className="text-sm text-gray-500">Đang tải...</span>
            </div>
          </div>
        )}

        {/* Loading indicator for next page */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              <span className="text-sm text-gray-500">Đang tải thêm...</span>
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
                <p className="text-gray-500">Không tìm thấy yêu cầu nào</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* End of results indicator */}
        {!hasNextPage && requests.length > 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Đã hiển thị tất cả kết quả</p>
          </div>
        )}
      </div>
    </div>
  );
}
