import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  FileText,
  MapPin,
  Paperclip,
  Plane,
  Shield,
  User,
  Image as ImageIcon,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { type AccrualRequest } from "@/types/accrual-request";

interface AccrualRequestTicketProps {
  request: AccrualRequest;
}

interface ImageDisplayProps {
  src: string;
  alt: string;
  title: string;
}

function ImageDisplay({ src, alt, title }: ImageDisplayProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const openImageInNewTab = () => {
    window.open(src, '_blank');
  };

  if (imageError) {
    return (
      <div className="flex items-center space-x-2 text-sm bg-gray-50 p-2 rounded border border-gray-200">
        <ImageIcon className="w-4 h-4 text-gray-400" />
        <span>{title}</span>
        <Badge variant="outline" className="text-xs text-red-600 border-red-300">Lỗi tải ảnh</Badge>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 ml-auto"
          onClick={openImageInNewTab}
        >
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm">
          <ImageIcon className="w-4 h-4 text-gray-400" />
          <span>{title}</span>
          <Badge variant="outline" className="text-xs">Image</Badge>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
          onClick={openImageInNewTab}
          title="Mở ảnh trong tab mới"
        >
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>

      <div
        ref={imageRef}
        className="relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
      >
        {imageLoading && (
          <div className="flex items-center justify-center h-32 bg-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span>Đang tải ảnh...</span>
            </div>
          </div>
        )}

        {isInView && (
          <img
            src={src}
            alt={alt}
            className={`w-full h-auto max-h-64 object-contain ${imageLoading ? 'hidden' : 'block'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
        )}
      </div>
    </div>
  );
}

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Đang chờ</Badge>;
    case "inprogress":
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Đang xử lý</Badge>;
    case "approved":
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Đã duyệt</Badge>;
    case "rejected":
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Từ chối</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getVerificationStatusIcon = (status: string) => {
  switch (status) {
    case "checked":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "pending":
      return <Clock className="w-4 h-4 text-yellow-600" />;
    case "failed":
      return <span className="w-4 h-4 text-red-600">✕</span>;
    default:
      return <Clock className="w-4 h-4 text-gray-400" />;
  }
};

export function AccrualRequestTicket({ request }: AccrualRequestTicketProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Calculate total miles
  const totalMiles = request.qualifying_miles + request.bonus_miles;

  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardContent className="pt-6">
        {/* Basic ticket info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <div>
                <span className="font-medium">Customer ID: {request.customer_id}</span>
                <p className="text-xs text-gray-500">Ticket: {request.ticket_id}</p>
              </div>
            </div>
            <Badge variant="outline">{request.ticket_id}</Badge>
          </div>
          <div className="flex items-center space-x-3">
            {getStatusBadge(request.status)}
            <Button
              size="sm"
              variant="outline"
              className="flex items-center space-x-1"
              onClick={toggleExpansion}
            >
              {isExpanded ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Thu gọn</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Chi tiết</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Basic flight info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Plane className="w-4 h-4 text-gray-500" />
            <span>{request.carrier}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>{request.from_code} - {request.to_code}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{formatDate(request.departure_date)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-purple-600">{totalMiles.toLocaleString()} dặm</span>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            {/* Basic Ticket Information */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-lg px-3 py-1">{request.ticket_id}</Badge>
                <div>
                  <p className="font-medium text-lg">Customer ID: {request.customer_id}</p>
                  <p className="text-sm text-gray-600">PNR: {request.pnr}</p>
                  <p className="text-sm text-gray-600">Booking Class: {request.booking_class}</p>
                </div>
              </div>
              <div className="text-right">
                {getStatusBadge(request.status)}
                <p className="text-sm text-gray-600 mt-1">Ngày tạo: {formatDate(request.created_at)}</p>
              </div>
            </div>

            {/* Request Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin chuyến bay</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hãng bay:</span>
                      <span className="font-medium">{request.carrier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tuyến bay:</span>
                      <span className="font-medium">{request.from_code} - {request.to_code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày bay:</span>
                      <span className="font-medium">{formatDate(request.departure_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Khoảng cách:</span>
                      <span className="font-medium">{request.distance_miles.toLocaleString()} dặm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tỷ lệ tích dặm:</span>
                      <span className="font-medium">{request.qualifying_accrual_rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dặm hợp lệ:</span>
                      <span className="font-medium text-purple-600">{request.qualifying_miles.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tỷ lệ thưởng:</span>
                      <span className="font-medium">{request.bonus_accrual_rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dặm thưởng:</span>
                      <span className="font-medium text-purple-600">{request.bonus_miles.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng dặm:</span>
                      <span className="font-medium text-purple-600 font-bold">{totalMiles.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Paperclip className="w-4 h-4 mr-2" />
                    Hình ảnh đính kèm
                  </h4>
                  <div className="space-y-4">
                    {request.ticket_image_url && (
                      <ImageDisplay
                        src={request.ticket_image_url}
                        alt="Vé máy bay"
                        title="Vé máy bay"
                      />
                    )}
                    {request.boarding_pass_image_url && (
                      <ImageDisplay
                        src={request.boarding_pass_image_url}
                        alt="Boarding pass"
                        title="Boarding pass"
                      />
                    )}
                    {!request.ticket_image_url && !request.boarding_pass_image_url && (
                      <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded border border-gray-200">
                        Không có hình ảnh đính kèm
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Review Information */}
                {request.reviewer_id && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Thông tin đánh giá
                    </h4>
                    <div className="space-y-2 text-sm">
                      {request.reviewed_at && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ngày đánh giá:</span>
                          <span className="font-medium">{formatDate(request.reviewed_at)}</span>
                        </div>
                      )}
                      {request.rejected_reason && (
                        <div className="mt-2 p-2 bg-red-50 rounded">
                          <span className="text-red-700 text-sm">Lý do từ chối: {request.rejected_reason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* System Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin hệ thống</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày tạo:</span>
                      <span className="font-medium">{formatDate(request.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cập nhật lần cuối:</span>
                      <span className="font-medium">{formatDate(request.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Action Buttons - Only show for pending/inprogress requests */}
            {(request.status === "pending" || request.status === "inprogress") && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <p>Cần quyết định: Approve hoặc Reject</p>
                </div>
                <div className="flex space-x-3">
                  <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                    Từ chối
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Phê duyệt
                  </Button>
                </div>
              </div>
            )}

            {/* Show decision info for approved/rejected requests */}
            {(request.status === "approved" || request.status === "rejected") && request.reviewer_id && (
              <div className={`p-3 rounded text-sm ${request.status === "approved" ? "bg-green-50" : "bg-red-50"
                }`}>
                <p className={`font-medium mb-1 ${request.status === "approved" ? "text-green-800" : "text-red-800"
                  }`}>
                  Quyết định {request.status === "approved" ? "phê duyệt" : "từ chối"}:
                </p>
                {request.rejected_reason && (
                  <p className={request.status === "approved" ? "text-green-700" : "text-red-700"}>
                    {request.rejected_reason}
                  </p>
                )}
                {request.reviewed_at && (
                  <p className={`text-xs ${request.status === "approved" ? "text-green-600" : "text-red-600"
                    }`}>
                    Ngày quyết định: {formatDate(request.reviewed_at)}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
