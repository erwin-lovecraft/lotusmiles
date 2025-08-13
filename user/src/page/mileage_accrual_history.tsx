import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Search, Eye, Clock, CheckCircle, XCircle, AlertCircle, FileText, Calendar, User } from "lucide-react";
import { useState } from "react";

const requests: Request[] = [
  {
    id: "REQ2025001",
    type: "Chuyến bay thiếu dặm",
    description: "VN123 HCM-HN ngày 15/01/2025",
    submitDate: "16/01/2025",
    status: "processing",
    expectedMiles: "1,200",
    note: "Đang xác minh thông tin với hãng hàng không",
    details: {
      submittedBy: "Nguyễn Văn An",
      submissionDate: "16/01/2025 14:30",
      documents: ["Vé máy bay", "Boarding pass"],
      timeline: [
        { date: "16/01/2025 14:30", action: "Yêu cầu được gửi", status: "completed" },
        { date: "16/01/2025 15:45", action: "Bắt đầu xác minh", status: "completed" },
        { date: "17/01/2025 09:00", action: "Đang liên hệ hãng hàng không", status: "current" },
        { date: "", action: "Cộng dặm vào tài khoản", status: "pending" }
      ]
    }
  },
  {
    id: "REQ2025002",
    type: "Đặt phòng khách sạn",
    description: "Hilton Saigon - 2 đêm",
    submitDate: "13/01/2025",
    status: "completed",
    expectedMiles: "800",
    note: "Đã cộng dặm vào tài khoản",
    details: {
      submittedBy: "Nguyễn Văn An",
      submissionDate: "13/01/2025 10:15",
      documents: ["Xác nhận đặt phòng", "Hóa đơn thanh toán"],
      timeline: [
        { date: "13/01/2025 10:15", action: "Yêu cầu được gửi", status: "completed" },
        { date: "13/01/2025 11:30", action: "Xác minh thông tin", status: "completed" },
        { date: "14/01/2025 16:20", action: "Duyệt yêu cầu", status: "completed" },
        { date: "14/01/2025 16:25", action: "Đã cộng 800 dặm vào tài khoản", status: "completed" }
      ]
    }
  },
  {
    id: "REQ2025003",
    type: "Thẻ tín dụng",
    description: "Giao dịch tháng 12/2024",
    submitDate: "05/01/2025",
    status: "rejected",
    expectedMiles: "450",
    note: "Giao dịch không đủ điều kiện tích dặm",
    details: {
      submittedBy: "Nguyễn Văn An",
      submissionDate: "05/01/2025 09:45",
      documents: ["Sao kê thẻ tín dụng"],
      timeline: [
        { date: "05/01/2025 09:45", action: "Yêu cầu được gửi", status: "completed" },
        { date: "06/01/2025 14:20", action: "Xem xét yêu cầu", status: "completed" },
        { date: "07/01/2025 11:15", action: "Từ chối - Giao dịch không hợp lệ", status: "completed" }
      ],
      rejectionReason: "Các giao dịch này không thuộc danh mục được tính dặm theo điều khoản hợp tác với ngân hàng phát hành thẻ."
    }
  },
  {
    id: "REQ2024089",
    type: "Thuê xe",
    description: "Avis Car Rental - 3 ngày",
    submitDate: "28/12/2024",
    status: "pending",
    expectedMiles: "300",
    note: "Chờ xử lý",
    details: {
      submittedBy: "Nguyễn Văn An",
      submissionDate: "28/12/2024 16:20",
      documents: ["Hóa đơn thuê xe", "Hợp đồng thuê xe"],
      timeline: [
        { date: "28/12/2024 16:20", action: "Yêu cầu được gửi", status: "completed" },
        { date: "", action: "Xem xét yêu cầu", status: "pending" },
        { date: "", action: "Cộng dặm vào tài khoản", status: "pending" }
      ]
    }
  }
];

export interface Request {
  id: string;
  type: string;
  description: string;
  submitDate: string;
  status: string;
  expectedMiles: string;
  note: string;
  details: RequestDetail
}

export interface RequestDetail {
  submittedBy: string,
  submissionDate: string,
  documents: string[],
  timeline: {date: string, action: string, status:string}[]
  rejectionReason: string
}

export default function MileageAccrualHistory() {
  const [selectedRequest, setSelectedRequest] = useState<null | Request>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleViewDetail = (request: Request) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="w-4 h-4" />,
          badge: <Badge variant="secondary" className="bg-gray-100 text-gray-800">Chờ xử lý</Badge>,
          color: 'text-gray-600'
        };
      case 'processing':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          badge: <Badge variant="secondary" className="bg-blue-100 text-blue-800">Đang xử lý</Badge>,
          color: 'text-blue-600'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          badge: <Badge variant="default" className="bg-green-100 text-green-800">Hoàn thành</Badge>,
          color: 'text-green-600'
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-4 h-4" />,
          badge: <Badge variant="destructive" className="bg-red-100 text-red-800">Từ chối</Badge>,
          color: 'text-red-600'
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          badge: <Badge variant="secondary">Không xác định</Badge>,
          color: 'text-gray-600'
        };
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Theo dõi trạng thái yêu cầu</h1>
        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Kiểm tra tình trạng xử lý các yêu cầu tích dặm thủ công</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm theo mã yêu cầu..."
              className="pl-10 text-sm sm:text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Request List */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Danh sách yêu cầu</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 sm:space-y-4">
            {requests.map((request) => {
              const statusInfo = getStatusInfo(request.status);

              return (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{request.id}</h4>
                        {statusInfo.badge}
                      </div>

                      <div className="space-y-1 mb-3">
                        <p className="text-gray-900 text-sm sm:text-base">{request.description}</p>
                        <p className="text-xs sm:text-sm text-gray-500">Loại: {request.type}</p>
                        <p className="text-xs sm:text-sm text-gray-500">Ngày gửi: {request.submitDate}</p>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <div className={statusInfo.color}>
                          {statusInfo.icon}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">{request.note}</p>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start sm:text-right sm:ml-4 space-x-2 sm:space-x-0">
                      <div>
                        <p className="font-semibold text-purple-600 text-sm sm:text-base">{request.expectedMiles} dặm</p>
                        <p className="text-xs sm:text-sm text-gray-500">Dự kiến</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetail(request)} className="flex-shrink-0">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="text-xs sm:text-sm">Chi tiết</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Status Guide */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Giải thích trạng thái</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Chờ xử lý - Yêu cầu đã được tiếp nhận</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Đang xử lý - Đang xác minh thông tin</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Hoàn thành - Đã cộng dặm thành công</span>
            </div>
            <div className="flex items-center space-x-2">
              <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Từ chối - Yêu cầu không hợp lệ</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>Chi tiết yêu cầu {selectedRequest?.id}</span>
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 sm:space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-sm sm:text-base">Thông tin cơ bản</h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã yêu cầu:</span>
                      <span className="font-medium">{selectedRequest.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại yêu cầu:</span>
                      <span>{selectedRequest.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dặm dự kiến:</span>
                      <span className="font-semibold text-purple-600">{selectedRequest.expectedMiles}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span>{getStatusInfo(selectedRequest.status).badge}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-sm sm:text-base">Thông tin gửi yêu cầu</h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Người gửi:</span>
                      <span className="flex items-center">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {selectedRequest.details.submittedBy}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời gian gửi:</span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {selectedRequest.details.submissionDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Service Specific Info */}
              <div>
                <h4 className="font-semibold mb-3 text-sm sm:text-base">Thông tin chi tiết dịch vụ</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {selectedRequest.details.flightInfo && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 block">Số hiệu chuyến bay:</span>
                        <span className="font-medium">{selectedRequest.details.flightInfo.flightNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Tuyến đường:</span>
                        <span>{selectedRequest.details.flightInfo.route}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Ngày bay:</span>
                        <span>{selectedRequest.details.flightInfo.date}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Mã đặt chỗ:</span>
                        <span className="font-medium">{selectedRequest.details.flightInfo.bookingCode}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600 block">Số vé:</span>
                        <span className="font-medium">{selectedRequest.details.flightInfo.ticketNumber}</span>
                      </div>
                    </div>
                  )}

                  {selectedRequest.details.hotelInfo && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 block">Tên khách sạn:</span>
                        <span className="font-medium">{selectedRequest.details.hotelInfo.hotelName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Số đêm:</span>
                        <span>{selectedRequest.details.hotelInfo.nights} đêm</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Check-in:</span>
                        <span>{selectedRequest.details.hotelInfo.checkIn}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Check-out:</span>
                        <span>{selectedRequest.details.hotelInfo.checkOut}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600 block">Mã xác nhận:</span>
                        <span className="font-medium">{selectedRequest.details.hotelInfo.confirmationNumber}</span>
                      </div>
                    </div>
                  )}

                  {selectedRequest.details.cardInfo && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 block">Loại thẻ:</span>
                        <span className="font-medium">{selectedRequest.details.cardInfo.cardType}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Kỳ giao dịch:</span>
                        <span>{selectedRequest.details.cardInfo.transactionPeriod}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Tổng chi tiêu:</span>
                        <span>{selectedRequest.details.cardInfo.totalAmount}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Chi tiêu hợp lệ:</span>
                        <span className="font-medium">{selectedRequest.details.cardInfo.qualifyingAmount}</span>
                      </div>
                    </div>
                  )}

                  {selectedRequest.details.rentalInfo && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 block">Công ty:</span>
                        <span className="font-medium">{selectedRequest.details.rentalInfo.company}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Số ngày thuê:</span>
                        <span>{selectedRequest.details.rentalInfo.days} ngày</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Ngày nhận xe:</span>
                        <span>{selectedRequest.details.rentalInfo.pickupDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Ngày trả xe:</span>
                        <span>{selectedRequest.details.rentalInfo.returnDate}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600 block">Mã xác nhận:</span>
                        <span className="font-medium">{selectedRequest.details.rentalInfo.confirmationNumber}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Documents */}
              <div>
                <h4 className="font-semibold mb-3 text-sm sm:text-base">Tài liệu đính kèm</h4>
                <div className="space-y-2">
                  {selectedRequest.details.documents.map((doc: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Timeline */}
              <div>
                <h4 className="font-semibold mb-3 text-sm sm:text-base">Lịch sử xử lý</h4>
                <div className="space-y-4">
                  {selectedRequest.details.timeline.map((event: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full mt-1 ${
                        event.status === 'completed' ? 'bg-green-500' :
                          event.status === 'current' ? 'bg-blue-500' :
                            'bg-gray-300'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{event.action}</span>
                          {event.date && (
                            <span className="text-xs text-gray-500">{event.date}</span>
                          )}
                        </div>
                        {event.status === 'current' && (
                          <span className="text-xs text-blue-600">Đang thực hiện</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejection Reason */}
              {selectedRequest.details.rejectionReason && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-3 text-red-600">Lý do từ chối</h4>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <p className="text-sm text-red-800">{selectedRequest.details.rejectionReason}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
