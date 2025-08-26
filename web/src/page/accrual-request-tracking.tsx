import { Input } from "@/components/ui/input";
import { Search, Loader2, Filter } from "lucide-react";
import MileageRequestPreview from "@/components/mileage-request-preview.tsx";
import AccrualRequestDetailDialog from "@/components/accrual-request-detail-dialog.tsx";
import { useInfiniteAccrualRequests } from "@/lib/hooks/use-infinite-accrual-requests";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useState, useRef, useCallback } from "react";
import type { MileageAccrualRequest } from "@/types/mileage-accrual-request";
import { useTranslations } from '@/lib/hooks';

export default function MileageAccrualTrackingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<MileageAccrualRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { tracking, common } = useTranslations();

  // Debounce search term with 500ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteAccrualRequests({
    keyword: debouncedSearchTerm,
  });

  // Intersection observer for infinite scroll
  const observer = useRef<IntersectionObserver | undefined>(undefined);
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  // Flatten all pages data
  const allRequests = data?.pages.flatMap((page) => page.data) || [];
  const total = data?.pages[0]?.total || 0;

  const handleViewDetail = (request: MileageAccrualRequest) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedRequest(null);
  };

  if (isLoading && !data) {
    return (
      <div className="space-y-6 max-w-full">
        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Search className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{tracking.title}</h1>
              <p className="text-sm sm:text-base text-gray-500">{tracking.subtitle}</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder={tracking.searchPlaceholder}
              className="pl-12 h-12 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              disabled
            />
          </div>
        </div>

        {/* Loading State */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col items-center justify-center py-8 sm:py-12">
            <div className="relative">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <div className="absolute inset-0 rounded-full border-2 border-purple-200 animate-ping"></div>
            </div>
            <p className="mt-4 text-base sm:text-lg font-medium text-gray-700">{tracking.loadingRequests}</p>
            <p className="mt-2 text-sm text-gray-500">{common.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-full">
        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Search className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mileage Accrual Requests</h1>
              <p className="text-sm sm:text-base text-gray-500">Track and manage your mileage requests</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by ticket ID or PNR..."
              className="pl-12 h-12 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              disabled
            />
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
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Failed to load requests</h3>
            <p className="text-sm text-gray-500 text-center max-w-md">
              We encountered an error while loading your requests. Please try refreshing the page or contact support if the problem persists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      {/* Search Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Search className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Mileage Accrual Requests</h1>
            <p className="text-sm sm:text-base text-gray-500">Track and manage your mileage requests</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search by ticket ID or PNR..."
            className="pl-12 h-12 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 px-2">
          <Filter className="w-4 h-4" />
          <span>{total} total requests</span>
        </div>

        {allRequests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <div className="p-3 bg-gray-100 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 text-center">
                {debouncedSearchTerm ? "No matching requests found" : "No requests yet"}
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-md">
                {debouncedSearchTerm
                  ? "Try adjusting your search terms or check the spelling."
                  : "Your mileage accrual requests will appear here once submitted."
                }
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Results Grid */}
            <div className="space-y-4">
              {allRequests.map((request, index) => {
                const isLast = index === allRequests.length - 1;
                return (
                  <div key={request.id.toString()} ref={isLast ? lastElementRef : undefined}>
                    <MileageRequestPreview
                      id={`request-${request.id}`}
                      data={request}
                      onViewDetail={handleViewDetail}
                    />
                  </div>
                );
              })}
            </div>

            {/* Loading indicator for next page */}
            {isFetchingNextPage && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600 mr-3" />
                  <span className="text-gray-600 font-medium">Loading more requests...</span>
                </div>
              </div>
            )}

            {/* End of results indicator */}
            {!hasNextPage && allRequests.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <span className="text-sm">You've reached the end</span>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Dialog */}
      <AccrualRequestDetailDialog
        request={selectedRequest}
        open={isDetailOpen}
        onOpenChange={handleCloseDetail}
      />
    </div>
  );
}
