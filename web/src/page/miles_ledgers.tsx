import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2, Filter, Calendar, TrendingUp } from "lucide-react";
import TransactionPreview from "@/components/transaction-preview.tsx";
import { useMilesLedgers } from "@/lib/services/miles-ledgers";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useState } from "react";

export default function MilesLedgers() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [transactionId, setTransactionId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dateRange, setDateRange] = useState("all");

  // Debounce search term with 500ms delay
  const debouncedTransactionId = useDebounce(transactionId, 500);

  const { data: response, isLoading, error } = useMilesLedgers({
    page,
    size,
    transaction_id: debouncedTransactionId || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
  });

  const transactions = response?.data || [];
  const total = response?.total || 0;
  const totalPages = Math.ceil(total / size);

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    const today = new Date();

    switch (value) {
      case "today": {
        const todayStr = today.toISOString().split('T')[0];
        setDateFrom(todayStr);
        setDateTo(todayStr);
        break;
      }
      case "thisWeek": {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        setDateFrom(weekStart.toISOString().split('T')[0]);
        setDateTo(weekEnd.toISOString().split('T')[0]);
        break;
      }
      case "thisMonth": {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        setDateFrom(monthStart.toISOString().split('T')[0]);
        setDateTo(monthEnd.toISOString().split('T')[0]);
        break;
      }
      case "lastMonth": {
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        setDateFrom(lastMonthStart.toISOString().split('T')[0]);
        setDateTo(lastMonthEnd.toISOString().split('T')[0]);
        break;
      }
      default:
        setDateFrom("");
        setDateTo("");
        break;
    }
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSizeChange = (newSize: string) => {
    const sizeNum = parseInt(newSize);
    setSize(sizeNum);
    setPage(1);
  };

  const clearFilters = () => {
    setTransactionId("");
    setDateFrom("");
    setDateTo("");
    setDateRange("all");
    setPage(1);
  };

  if (isLoading && !response) {
    return (
      <div className="space-y-6 max-w-full">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mileage Ledgers</h1>
              <p className="text-sm sm:text-base text-gray-500">Track your mileage transactions and balance</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col items-center justify-center py-8 sm:py-12">
            <div className="relative">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <div className="absolute inset-0 rounded-full border-2 border-purple-200 animate-ping"></div>
            </div>
            <p className="mt-4 text-base sm:text-lg font-medium text-gray-700">Loading your transactions...</p>
            <p className="mt-2 text-sm text-gray-500">Please wait while we fetch your data</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-full">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mileage Ledgers</h1>
              <p className="text-sm sm:text-base text-gray-500">Track your mileage transactions and balance</p>
            </div>
          </div>
        </div>

        {/* Error State */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col items-center justify-center py-8 sm:py-12">
            <div className="p-3 bg-red-100 rounded-full mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Failed to load transactions</h3>
            <p className="text-sm text-gray-500 text-center max-w-md">
              We encountered an error while loading your transactions. Please try refreshing the page or contact support if the problem persists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Mileage Ledgers</h1>
            <p className="text-sm sm:text-base text-gray-500">Track your mileage transactions and balance</p>
          </div>

        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Transaction ID Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by transaction ID..."
              className="pl-10"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </div>

          {/* Date Range Selector */}
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
            </SelectContent>
          </Select>

          {/* Custom Date From */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="date"
              placeholder="From date"
              className="pl-10"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          {/* Custom Date To */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="date"
              placeholder="To date"
              className="pl-10"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {(transactionId || dateFrom || dateTo) && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 mx-2">
        <Filter className="w-4 h-4" />
        <span>{total} total transactions</span>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <div className="p-3 bg-gray-100 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 text-center">
                No transactions found
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-md">
                {transactionId || dateFrom || dateTo
                  ? "Try adjusting your filters or search terms."
                  : "Your mileage transactions will appear here once you have activity."
                }
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Transactions List */}
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <TransactionPreview
                  key={transaction.id.toString()}
                  id={`transaction-${transaction.id}`}
                  data={transaction}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Show:</span>
                    <Select value={size.toString()} onValueChange={handleSizeChange}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-500">per page</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
