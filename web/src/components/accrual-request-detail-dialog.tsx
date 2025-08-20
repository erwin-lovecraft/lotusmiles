import type { MileageAccrualRequest } from "@/types/mileage-accrual-request.ts";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { AlertCircle, CheckCircle, Clock, XCircle, Calendar, MapPin, Plane, CreditCard, FileText, User, Award } from "lucide-react";
import { format } from "date-fns";

interface AccrualRequestDetailDialogProps {
  request: MileageAccrualRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusInfo = (data: MileageAccrualRequest) => {
  switch (data.status) {
    case 'pending':
      return {
        icon: <Clock className="w-5 h-5"/>,
        badge: <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>,
        color: 'text-amber-600',
        label: "Submitted to Admin"
      };
    case 'inprogress':
      return {
        icon: <AlertCircle className="w-5 h-5"/>,
        badge: <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>,
        color: 'text-blue-600',
        label: 'Admin reviewing'
      };
    case 'approved':
      return {
        icon: <CheckCircle className="w-5 h-5"/>,
        badge: <Badge variant="default" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>,
        color: 'text-green-600',
        label: "Admin approved"
      };
    case 'rejected':
      return {
        icon: <XCircle className="w-5 h-5"/>,
        badge: <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>,
        color: 'text-red-600',
        label: data.rejected_reason
      };
    default:
      return {
        icon: <Clock className="w-5 h-5"/>,
        badge: <Badge variant="secondary" className="bg-gray-50 text-gray-700 border-gray-200">Unknown</Badge>,
        color: 'text-gray-600'
      };
  }
};

export default function AccrualRequestDetailDialog({
  request,
  open,
  onOpenChange,
}: AccrualRequestDetailDialogProps) {
  if (!request) return null;

  const statusInfo = getStatusInfo(request);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  Request #{request.id}
                </DialogTitle>
                <p className="text-purple-100 text-sm">Mileage Accrual Request Details</p>
              </div>
            </div>
            {statusInfo.badge}
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center gap-2 text-purple-100">
            <div className={statusInfo.color}>
              {statusInfo.icon}
            </div>
            <span className="text-sm">{statusInfo.label}</span>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Request ID</p>
                  <p className="text-lg font-semibold text-gray-900">{request.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Submit Date</p>
                  <p className="text-lg font-semibold text-gray-900">{format(new Date(request.created_at), "MMM dd, yyyy 'at' HH:mm")}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Last Updated</p>
                  <p className="text-lg font-semibold text-gray-900">{format(new Date(request.updated_at), "MMM dd, yyyy 'at' HH:mm")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Status</p>
                  <div className="flex items-center gap-2">
                    <div className={statusInfo.color}>{statusInfo.icon}</div>
                    <span className="text-lg font-semibold text-gray-900">{statusInfo.label}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flight Information */}
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plane className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Flight Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Ticket ID</p>
                    <p className="text-lg font-semibold text-gray-900">{request.ticket_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">PNR</p>
                    <p className="text-lg font-semibold text-gray-900">{request.pnr}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Plane className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Carrier & Class</p>
                    <p className="text-lg font-semibold text-gray-900">{request.carrier} - {request.booking_class}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Route</p>
                    <p className="text-lg font-semibold text-gray-900">{request.from_code} → {request.to_code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Departure Date</p>
                    <p className="text-lg font-semibold text-gray-900">{format(new Date(request.departure_date), "MMM dd, yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Distance</p>
                    <p className="text-lg font-semibold text-gray-900">{request.distance_miles.toLocaleString()} miles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Miles Information */}
          <div className="bg-purple-50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Miles Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Qualifying Miles</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-purple-600">{request.qualifying_miles.toLocaleString()}</p>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {request.qualifying_accrual_rate}x Rate
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Bonus Miles</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-purple-600">{request.bonus_miles.toLocaleString()}</p>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {request.bonus_accrual_rate}x Rate
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Information */}
          {request.reviewed_at && (
            <div className="bg-green-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Review Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Reviewed At</p>
                  <p className="text-lg font-semibold text-gray-900">{format(new Date(request.reviewed_at), "MMM dd, yyyy 'at' HH:mm")}</p>
                </div>
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {request.rejected_reason && (
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-800">Rejection Reason</h3>
              </div>
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <p className="text-red-800 font-medium">{request.rejected_reason}</p>
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Ticket Image</p>
                {request.ticket_image_url && (
                  <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img 
                      src={request.ticket_image_url} 
                      alt="Ticket" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Boarding Pass Image</p>
                {request.boarding_pass_image_url && (
                  <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img 
                      src={request.boarding_pass_image_url} 
                      alt="Boarding Pass" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
