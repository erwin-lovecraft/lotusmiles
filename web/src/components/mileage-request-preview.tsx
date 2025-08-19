import type { MileageAccrualRequest } from "@/types/mileage_accrual_request.ts";
import { Button } from "@/components/ui/button.tsx";
import { AlertCircle, CheckCircle, Clock, Eye, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import { format } from "date-fns";

export type MileageRequestPreviewProps = {
  id: string;
  data: MileageAccrualRequest
  className?: string;
}

const getStatusInfo = (data: MileageAccrualRequest) => {
  switch (data.status) {
    case 'pending':
      return {
        icon: <Clock className="w-4 h-4"/>,
        badge: <Badge variant="secondary" className="bg-gray-100 text-gray-800">Chờ xử lý</Badge>,
        color: 'text-gray-600',
        label: "Submitted to Admin"
      };
    case 'inprogress':
      return {
        icon: <AlertCircle className="w-4 h-4"/>,
        badge: <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>,
        color: 'text-blue-600',
        label: 'Admin reviewing'
      };
    case 'approved':
      return {
        icon: <CheckCircle className="w-4 h-4"/>,
        badge: <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>,
        color: 'text-green-600',
        label: "Admin approved"
      };
    case 'rejected':
      return {
        icon: <XCircle className="w-4 h-4"/>,
        badge: <Badge variant="destructive" className="bg-red-100 text-red-800">Rejected</Badge>,
        color: 'text-red-600',
        label: data.rejected_reason
      };
    default:
      return {
        icon: <Clock className="w-4 h-4"/>,
        badge: <Badge variant="secondary">Unknown</Badge>,
        color: 'text-gray-600'
      };
  }
};

export default function MileageRequestPreview(props: MileageRequestPreviewProps) {
  const {data} = props;

  const statusInfo = getStatusInfo(data)

  const handleViewDetail = (requestID: bigint) => {
    console.log(requestID)
  }

  return (
    <div key={data.id} className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{data.id}</h4>
            {statusInfo.badge}
          </div>

          <div className="space-y-1 mb-3">
            <p className="text-xs sm:text-sm text-gray-500">Submit Date: {format(data.submitted_date, "dd/MM/yyyy")}</p>
          </div>

          <div className="flex items-center space-x-2 mb-2">
            <div className={statusInfo.color}>
              {statusInfo.icon}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">{statusInfo.label}</p>
          </div>
        </div>

        <div
          className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start sm:text-right sm:ml-4 space-x-2 sm:space-x-0">
          <div>
            <p className="font-semibold text-purple-600 text-sm sm:text-base">Qualifying Miles: {data.qualifying_miles}</p>
            <p className="font-semibold text-purple-600 text-sm sm:text-base">Bonus Miles: {data.bonus_miles}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleViewDetail(data.id)} className="flex-shrink-0">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"/>
            <span className="text-xs sm:text-sm">Detail</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
