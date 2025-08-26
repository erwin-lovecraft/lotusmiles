import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Eye,
  EyeOff,
  MapPin,
  Paperclip,
  Plane,
  Shield,
  User,
  Image as ImageIcon,
  ExternalLink,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { type AccrualRequest } from "@/types/accrual-request";
import { RejectDialog } from "./reject-dialog";
import { useApproveAccrualRequest, useRejectAccrualRequest } from "@/lib/hooks";
import { getStatusBadge } from "@/lib/utils/status-badge";
import Big from 'big.js';
import { useTranslation } from "react-i18next";

interface AccrualRequestTicketProps {
  request: AccrualRequest;
}

interface ImageDisplayProps {
  src: string;
  alt: string;
  title: string;
}

function ImageDisplay({ src, alt, title }: ImageDisplayProps) {
  const { t } = useTranslation();
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
        <Badge variant="outline" className="text-xs text-red-600 border-red-300">{t('requestTicket.imageLoadError')}</Badge>
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
          title={t('requestTicket.openImageInNewTab')}
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
              <span>{t('requestTicket.loadingImage')}</span>
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

export function AccrualRequestTicket({ request }: AccrualRequestTicketProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [copiedRequestId, setCopiedRequestId] = useState(false);
  const [copiedTicketId, setCopiedTicketId] = useState(false);

  const approveMutation = useApproveAccrualRequest();
  const rejectMutation = useRejectAccrualRequest();

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Calculate total miles
  const totalMiles = request.qualifying_miles + request.bonus_miles;

  // Convert Big.js to string for display
  const formatBigId = (value: Big | null): string => {
    if (value === null || value === undefined) return 'N/A';
    return value.toString();
  };

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(request.id);
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleReject = async (rejectReason: string) => {
    try {
      await rejectMutation.mutateAsync({ id: request.id, rejectReason });
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleCopyRequestId = async () => {
    try {
      await navigator.clipboard.writeText(formatBigId(request.id));
      setCopiedRequestId(true);
      setTimeout(() => setCopiedRequestId(false), 2000);
    } catch (error) {
      console.error('Failed to copy Request ID:', error);
    }
  };

  const handleCopyTicketId = async () => {
    try {
      await navigator.clipboard.writeText(request.ticket_id);
      setCopiedTicketId(true);
      setTimeout(() => setCopiedTicketId(false), 2000);
    } catch (error) {
      console.error('Failed to copy Ticket ID:', error);
    }
  };

  const isActionLoading = approveMutation.isPending || rejectMutation.isPending;

  return (
    <>
      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="pt-6">
          {/* Basic ticket info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{t('requestTicket.requestId')}:</span>
                    <button
                      onClick={handleCopyRequestId}
                      className={`font-mono text-sm px-2 py-1 rounded border transition-all duration-200 ${copiedRequestId
                        ? 'bg-green-50 text-green-700 border-green-300 scale-105'
                        : 'text-gray-600 hover:text-gray-800 bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      title={copiedRequestId ? t('requestTicket.copied') : t('requestTicket.copyRequestId')}
                    >
                      {copiedRequestId ? `✓ ${t('requestTicket.copied')}!` : formatBigId(request.id)}
                    </button>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <div className="flex items-center space-x-2">
                      <span>{t('requestTicket.ticketId')}:</span>
                      <button
                        onClick={handleCopyTicketId}
                        className={`font-mono px-2 py-1 rounded border transition-all duration-200 ${copiedTicketId
                          ? 'bg-green-50 text-green-700 border-green-300 scale-105'
                          : 'text-gray-600 hover:text-gray-800 bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        title={copiedTicketId ? t('requestTicket.copied') : t('requestTicket.copyTicketId')}
                      >
                        {copiedTicketId ? `✓ ${t('requestTicket.copied')}!` : request.ticket_id}
                      </button>
                    </div>
                    {request.customer && (
                      <span className="text-blue-600 font-medium">
                        {request.customer.first_name} {request.customer.last_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(request.status, t)}
              <Button
                size="sm"
                variant="outline"
                className="flex items-center space-x-1"
                onClick={toggleExpansion}
              >
                {isExpanded ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>{t('requestTicket.collapse')}</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>{t('requestTicket.details')}</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Basic flight info */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
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
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                {t('requestTicket.qualifyingMiles')}: {request.qualifying_miles.toLocaleString()}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                {t('requestTicket.bonusMiles')}: {request.bonus_miles.toLocaleString()}
              </Badge>
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
                    <p className="font-medium text-lg">{t('requestTicket.requestId')}: {formatBigId(request.id)}</p>
                    <p className="text-sm text-gray-600">Customer ID: {formatBigId(request.customer_id)}</p>
                    <p className="text-sm text-gray-600">PNR: {request.pnr}</p>
                    <p className="text-sm text-gray-600">Booking Class: {request.booking_class}</p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(request.status, t)}
                  <p className="text-sm text-gray-600 mt-1">{t('requestTicket.created')}: {formatDate(request.created_at)}</p>
                </div>
              </div>

              {/* Customer Information */}
              {request.customer && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {t('requestTicket.customerInfo')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('requestTicket.fullName')}:</span>
                        <span className="font-medium text-blue-700">
                          {request.customer.first_name} {request.customer.last_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('requestTicket.email')}:</span>
                        <span className="font-medium">{request.customer.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('requestTicket.phone')}:</span>
                        <span className="font-medium">{request.customer.phone || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('requestTicket.membershipTier')}:</span>
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${request.customer.member_tier === 'platinum' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                            request.customer.member_tier === 'gold' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                              request.customer.member_tier === 'silver' ? 'bg-gray-100 text-gray-800 border-gray-300' :
                                'bg-orange-100 text-orange-800 border-orange-300'
                            }`}
                        >
                          {request.customer.member_tier}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('requestTicket.totalQualifyingMiles')}:</span>
                        <span className="font-medium text-purple-600">
                          {request.customer.qualifying_miles_total.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('requestTicket.totalBonusMiles')}:</span>
                        <span className="font-medium text-purple-600">
                          {request.customer.bonus_miles_total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Request Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{t('requestTicket.flightInfo')}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('requestTicket.carrier')}:</span>
                        <span className="font-medium">{request.carrier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('requestTicket.route')}:</span>
                        <span className="font-medium">{request.from_code} - {request.to_code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('requestTicket.flightDate')}:</span>
                        <span className="font-medium">{formatDate(request.departure_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('requestTicket.distance')}:</span>
                        <span className="font-medium">{request.distance_miles.toLocaleString()} miles</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('requestTicket.qualifyingAccrualRate')}:</span>
                        <span className="font-medium">{request.qualifying_accrual_rate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('requestTicket.qualifyingMiles')}:</span>
                        <span className="font-medium text-blue-600">{request.qualifying_miles.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('requestTicket.bonusAccrualRate')}:</span>
                        <span className="font-medium">{request.bonus_accrual_rate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('requestTicket.bonusMiles')}:</span>
                        <span className="font-medium text-green-600">{request.bonus_miles.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-gray-600 font-medium">{t('requestTicket.totalMiles')}:</span>
                        <span className="font-bold text-gray-800">{totalMiles.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Attachments */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Paperclip className="w-4 h-4 mr-2" />
                      {t('requestTicket.attachedImages')}
                    </h4>
                    <div className="space-y-4">
                      {request.ticket_image_url && (
                        <ImageDisplay
                          src={request.ticket_image_url}
                          alt={t('requestTicket.flightTicket')}
                          title={t('requestTicket.flightTicket')}
                        />
                      )}
                      {request.boarding_pass_image_url && (
                        <ImageDisplay
                          src={request.boarding_pass_image_url}
                          alt={t('requestTicket.boardingPass')}
                          title={t('requestTicket.boardingPass')}
                        />
                      )}
                      {!request.ticket_image_url && !request.boarding_pass_image_url && (
                        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded border border-gray-200">
                          {t('requestTicket.noImagesAttached')}
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
                        {t('requestTicket.reviewInfo')}
                      </h4>
                      <div className="space-y-2 text-sm">
                        {request.reviewed_at && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('requestTicket.reviewDate')}:</span>
                            <span className="font-medium">{formatDate(request.reviewed_at)}</span>
                          </div>
                        )}
                        {request.rejected_reason && (
                          <div className="mt-2 p-2 bg-red-50 rounded">
                            <span className="text-red-700 text-sm">{t('requestTicket.rejectionReason')}: {request.rejected_reason}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* System Information */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{t('requestTicket.systemInfo')}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('requestTicket.created')}:</span>
                        <span className="font-medium">{formatDate(request.created_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('requestTicket.lastUpdated')}:</span>
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
                    <p>{t('requestTicket.decisionRequired')}</p>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => setShowRejectDialog(true)}
                      disabled={isActionLoading}
                    >
                      {rejectMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('common.processing')}
                        </>
                      ) : (
                        t('requestTicket.reject')
                      )}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleApprove}
                      disabled={isActionLoading}
                    >
                      {approveMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('common.processing')}
                        </>
                      ) : (
                        t('requestTicket.approve')
                      )}
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
                    {request.status === "approved" ? t('requestTicket.decisionToApprove') : t('requestTicket.decisionToReject')}
                  </p>
                  {request.rejected_reason && (
                    <p className={request.status === "approved" ? "text-green-700" : "text-red-700"}>
                      {request.rejected_reason}
                    </p>
                  )}
                  {request.reviewed_at && (
                    <p className={`text-xs ${request.status === "approved" ? "text-green-600" : "text-red-600"
                      }`}>
                      {t('requestTicket.decisionDate')}: {formatDate(request.reviewed_at)}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <RejectDialog
        isOpen={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        onConfirm={handleReject}
        ticketId={request.id}
      />
    </>
  );
}
