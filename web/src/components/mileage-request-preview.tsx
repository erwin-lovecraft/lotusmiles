import type { MileageAccrualRequest } from "@/types/mileage-accrual-request.ts";
import { Button } from "@/components/ui/button.tsx";
import { AlertCircle, CheckCircle, Clock, Eye, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import { format } from "date-fns";

export type MileageRequestPreviewProps = {
  id: string;
  data: MileageAccrualRequest;
  className?: string;
  onViewDetail: (request: MileageAccrualRequest) => void;
}

const getStatusInfo = (data: MileageAccrualRequest) => {
  switch (data.status) {
    case 'pending':
      return {
        icon: <Clock className="w-4 h-4" />,
        badge: <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>,
        color: 'text-amber-600',
        label: "Submitted to Admin"
      };
    case 'inprogress':
      return {
        icon: <AlertCircle className="w-4 h-4" />,
        badge: <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>,
        color: 'text-blue-600',
        label: 'Admin reviewing'
      };
    case 'approved':
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        badge: <Badge variant="default" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>,
        color: 'text-green-600',
        label: "Admin approved"
      };
    case 'rejected':
      return {
        icon: <XCircle className="w-4 h-4" />,
        badge: <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>,
        color: 'text-red-600',
        label: data.rejected_reason
      };
    default:
      return {
        icon: <Clock className="w-4 h-4" />,
        badge: <Badge variant="secondary" className="bg-gray-50 text-gray-700 border-gray-200">Unknown</Badge>,
        color: 'text-gray-600'
      };
  }
};

export default function MileageRequestPreview(props: MileageRequestPreviewProps) {
  const { data, onViewDetail } = props;

  const statusInfo = getStatusInfo(data);

  const handleViewDetail = () => {
    onViewDetail(data);
  };

  return (
    <div
      key={data.id}
      className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out overflow-hidden w-full max-w-full"
    >
      {/* Status indicator bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${data.status === 'approved' ? 'bg-green-500' : data.status === 'rejected' ? 'bg-red-500' : data.status === 'inprogress' ? 'bg-blue-500' : 'bg-amber-500'}`} />

      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                Request #{data.id}
              </h3>
              {statusInfo.badge}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className={statusInfo.color}>
                {statusInfo.icon}
              </div>
              <span className="truncate">{statusInfo.label}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Qualifying Miles
              </p>
              <p className="text-lg sm:text-xl font-bold text-purple-600">
                {data.qualifying_miles.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Bonus Miles
              </p>
              <p className="text-lg sm:text-xl font-bold text-purple-600">
                {data.bonus_miles.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Additional info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 text-sm text-gray-600">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1">
                <span className="text-gray-400">📅</span>
                <span className="truncate">{format(new Date(data.created_at), "MMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-400">✈️</span>
                <span className="truncate">{data.distance_miles.toLocaleString()} miles</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetail}
              className="group-hover:bg-purple-50 group-hover:border-purple-200 group-hover:text-purple-700 transition-colors w-full sm:w-auto"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
