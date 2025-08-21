import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, Loader2, Filter } from "lucide-react";
import { MileageLedgerItem } from "@/components/mileage-ledger-item";
import { useMileageLedgersInfinite, useIntersectionObserver, useDebounce } from "@/lib/hooks";
import type { MileageLedgerQueryParams } from "@/types/mileage-ledger";

export default function TransactionsPage() {
  // Filter states
  const [customerIdFilter, setCustomerIdFilter] = useState("");
  const [accrualRequestIdFilter, setAccrualRequestIdFilter] = useState("");

  // Debounce filters to avoid excessive API calls
  const debouncedCustomerId = useDebounce(customerIdFilter, 700);
  const debouncedAccrualRequestId = useDebounce(accrualRequestIdFilter, 700);

  // Build query params for API (without page parameter for infinite query)
  const baseQueryParams: Omit<MileageLedgerQueryParams, 'page'> = {
    customer_id: debouncedCustomerId || undefined,
    accrual_request_id: debouncedAccrualRequestId || undefined,
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
  } = useMileageLedgersInfinite(baseQueryParams);

  // Flatten all pages data into a single array
  const ledgers = data?.pages.flatMap(page => page.data) || [];
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
    setCustomerIdFilter("");
    setAccrualRequestIdFilter("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Ghi nhận giao dịch cộng dặm</span>
          </CardTitle>
          <CardDescription>
            Lịch sử và ghi nhận các giao dịch cộng dặm đã được xử lý
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Bộ lọc</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm">ID Khách hàng</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Nhập ID khách hàng..."
                  value={customerIdFilter}
                  onChange={(e) => setCustomerIdFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
              {customerIdFilter !== debouncedCustomerId && (
                <p className="text-xs text-gray-500">Đang tìm kiếm...</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm">ID Yêu cầu tích dặm</label>
              <Input
                placeholder="Nhập ID yêu cầu..."
                value={accrualRequestIdFilter}
                onChange={(e) => setAccrualRequestIdFilter(e.target.value)}
              />
              {accrualRequestIdFilter !== debouncedAccrualRequestId && (
                <p className="text-xs text-gray-500">Đang tìm kiếm...</p>
              )}
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
          Hiển thị {ledgers.length} trong tổng số {total} giao dịch
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

      {/* Ledgers List */}
      <div className="space-y-4">
        {ledgers.map((ledger) => (
          <MileageLedgerItem key={ledger.id.toString()} ledger={ledger} />
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
        {!loading && ledgers.length === 0 && !error && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-gray-500">Không tìm thấy giao dịch nào</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* End of results indicator */}
        {!hasNextPage && ledgers.length > 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Đã hiển thị tất cả kết quả</p>
          </div>
        )}
      </div>
    </div>
  );
}
