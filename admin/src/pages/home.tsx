import { useState } from "react";
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
import { useAccrualRequests, useDebounce } from "@/lib/hooks";
import type { AccrualRequestQueryParams } from "@/types/accrual-request";

export default function HomePage() {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 700);

  // Build query params for API
  const queryParams: AccrualRequestQueryParams = {
    keyword: debouncedSearchQuery || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    submitted_date: dateFilter || undefined,
    page: 1,
    size: 50, // Load more items per page
  };

  // Use React Query for API call and state management
  const {
    data: response,
    isLoading: loading,
    error,
    refetch
  } = useAccrualRequests(queryParams);

  const requests = response?.data || [];
  const total = response?.total || 0;

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
          <AccrualRequestTicket key={request.id} request={request} />
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-4">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              <span className="text-sm text-gray-500">Đang tải...</span>
            </div>
          </div>
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
      </div>
    </div>
  );
}
