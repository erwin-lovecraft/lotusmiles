import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { MILEAGE_ACCRUAL_REQUESTS } from "@/mocks/mocks.ts";
import MileageRequestPreview from "@/components/mileage-request-preview.tsx";

export default function MileageAccrualHistory() {
  const requests = MILEAGE_ACCRUAL_REQUESTS;

  // const [selectedRequest] = useState<null | Request>(null);
  // const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="p-2 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
            <Input
              placeholder="Find by ticket ID..."
              className="pl-10 text-sm sm:text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Request List */}
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl">Mileage Accrual Requests</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 sm:space-y-4">
            {requests.map((request) =>
              <MileageRequestPreview id={`request-${request.id}`} data={request}/>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Guide */}
      {/*<Card>*/}
      {/*  <CardHeader className="pb-3 sm:pb-6">*/}
      {/*    <CardTitle className="text-lg sm:text-xl">Giải thích trạng thái</CardTitle>*/}
      {/*  </CardHeader>*/}
      {/*  <CardContent className="pt-0">*/}
      {/*    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">*/}
      {/*      <div className="flex items-center space-x-2">*/}
      {/*        <Clock className="w-4 h-4 text-gray-600 flex-shrink-0"/>*/}
      {/*        <span className="text-xs sm:text-sm">Chờ xử lý - Yêu cầu đã được tiếp nhận</span>*/}
      {/*      </div>*/}
      {/*      <div className="flex items-center space-x-2">*/}
      {/*        <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0"/>*/}
      {/*        <span className="text-xs sm:text-sm">Đang xử lý - Đang xác minh thông tin</span>*/}
      {/*      </div>*/}
      {/*      <div className="flex items-center space-x-2">*/}
      {/*        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0"/>*/}
      {/*        <span className="text-xs sm:text-sm">Hoàn thành - Đã cộng dặm thành công</span>*/}
      {/*      </div>*/}
      {/*      <div className="flex items-center space-x-2">*/}
      {/*        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0"/>*/}
      {/*        <span className="text-xs sm:text-sm">Từ chối - Yêu cầu không hợp lệ</span>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </CardContent>*/}
      {/*</Card>*/}

      {/* Detail Modal */}
      {/*<Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>*/}
      {/*  <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto mx-auto sm:mx-auto">*/}
      {/*    <DialogHeader>*/}
      {/*      <DialogTitle className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base">*/}
      {/*        <FileText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"/>*/}
      {/*        <span>Chi tiết yêu cầu {selectedRequest?.id}</span>*/}
      {/*      </DialogTitle>*/}
      {/*    </DialogHeader>*/}

      {/*    {selectedRequest && (*/}
      {/*      <div className="space-y-4 sm:space-y-6">*/}
      {/*        /!* Basic Info *!/*/}
      {/*        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">*/}
      {/*          <div>*/}
      {/*            <h4 className="font-semibold mb-3 text-sm sm:text-base">Thông tin cơ bản</h4>*/}
      {/*            <div className="space-y-2 text-xs sm:text-sm">*/}
      {/*              <div className="flex justify-between">*/}
      {/*                <span className="text-gray-600">Mã yêu cầu:</span>*/}
      {/*                <span className="font-medium">{selectedRequest.id}</span>*/}
      {/*              </div>*/}
      {/*              <div className="flex justify-between">*/}
      {/*                <span className="text-gray-600">Loại yêu cầu:</span>*/}
      {/*                <span>{selectedRequest.type}</span>*/}
      {/*              </div>*/}
      {/*              <div className="flex justify-between">*/}
      {/*                <span className="text-gray-600">Dặm dự kiến:</span>*/}
      {/*                <span className="font-semibold text-purple-600">{selectedRequest.expectedMiles}</span>*/}
      {/*              </div>*/}
      {/*              <div className="flex justify-between items-center">*/}
      {/*                <span className="text-gray-600">Trạng thái:</span>*/}
      {/*                <span>{getStatusInfo(selectedRequest.status).badge}</span>*/}
      {/*              </div>*/}
      {/*            </div>*/}
      {/*          </div>*/}

      {/*          <div>*/}
      {/*            <h4 className="font-semibold mb-3 text-sm sm:text-base">Thông tin gửi yêu cầu</h4>*/}
      {/*            <div className="space-y-2 text-xs sm:text-sm">*/}
      {/*              <div className="flex justify-between">*/}
      {/*                <span className="text-gray-600">Người gửi:</span>*/}
      {/*                <span className="flex items-center">*/}
      {/*                  <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1"/>*/}
      {/*                  {selectedRequest.details.submittedBy}*/}
      {/*                </span>*/}
      {/*              </div>*/}
      {/*              <div className="flex justify-between">*/}
      {/*                <span className="text-gray-600">Thời gian gửi:</span>*/}
      {/*                <span className="flex items-center">*/}
      {/*                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1"/>*/}
      {/*                  {selectedRequest.details.submissionDate}*/}
      {/*                </span>*/}
      {/*              </div>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*        </div>*/}

      {/*        <Separator/>*/}

      {/*        /!* Service Specific Info *!/*/}
      {/*        /!*<div>*!/*/}
      {/*        /!*  <h4 className="font-semibold mb-3 text-sm sm:text-base">Thông tin chi tiết dịch vụ</h4>*!/*/}
      {/*        /!*  <div className="bg-gray-50 p-4 rounded-lg">*!/*/}
      {/*        /!*    {selectedRequest.details.flightInfo && (*!/*/}
      {/*        /!*      <div className="grid grid-cols-2 gap-4 text-sm">*!/*/}
      {/*        /!*        <div>*!/*/}
      {/*        /!*          <span className="text-gray-600 block">Số hiệu chuyến bay:</span>*!/*/}
      {/*        /!*          <span className="font-medium">{selectedRequest.details.flightInfo.flightNumber}</span>*!/*/}
      {/*        /!*        </div>*!/*/}
      {/*        /!*        <div>*!/*/}
      {/*        /!*          <span className="text-gray-600 block">Tuyến đường:</span>*!/*/}
      {/*        /!*          <span>{selectedRequest.details.flightInfo.route}</span>*!/*/}
      {/*        /!*        </div>*!/*/}
      {/*        /!*        <div>*!/*/}
      {/*        /!*          <span className="text-gray-600 block">Ngày bay:</span>*!/*/}
      {/*        /!*          <span>{selectedRequest.details.flightInfo.date}</span>*!/*/}
      {/*        /!*        </div>*!/*/}
      {/*        /!*        <div>*!/*/}
      {/*        /!*          <span className="text-gray-600 block">Mã đặt chỗ:</span>*!/*/}
      {/*        /!*          <span className="font-medium">{selectedRequest.details.flightInfo.bookingCode}</span>*!/*/}
      {/*        /!*        </div>*!/*/}
      {/*        /!*        <div className="col-span-2">*!/*/}
      {/*        /!*          <span className="text-gray-600 block">Số vé:</span>*!/*/}
      {/*        /!*          <span className="font-medium">{selectedRequest.details.flightInfo.ticketNumber}</span>*!/*/}
      {/*        /!*        </div>*!/*/}
      {/*        /!*      </div>*!/*/}
      {/*        /!*    )}*!/*/}

      {/*        /!*  </div>*!/*/}
      {/*        /!*</div>*!/*/}

      {/*        /!*<Separator />*!/*/}

      {/*        /!* Documents *!/*/}
      {/*        <div>*/}
      {/*          <h4 className="font-semibold mb-3 text-sm sm:text-base">Tài liệu đính kèm</h4>*/}
      {/*          <div className="space-y-2">*/}
      {/*            {selectedRequest.details.documents.map((doc: string, index: number) => (*/}
      {/*              <div key={index} className="flex items-center space-x-2 text-sm">*/}
      {/*                <FileText className="w-4 h-4 text-blue-600"/>*/}
      {/*                <span>{doc}</span>*/}
      {/*              </div>*/}
      {/*            ))}*/}
      {/*          </div>*/}
      {/*        </div>*/}

      {/*        <Separator/>*/}

      {/*        /!* Timeline *!/*/}
      {/*        <div>*/}
      {/*          <h4 className="font-semibold mb-3 text-sm sm:text-base">Lịch sử xử lý</h4>*/}
      {/*          <div className="space-y-4">*/}
      {/*            {selectedRequest.details.timeline.map((event: any, index: number) => (*/}
      {/*              <div key={index} className="flex items-start space-x-3">*/}
      {/*                <div className={`w-3 h-3 rounded-full mt-1 ${*/}
      {/*                  event.status === 'completed' ? 'bg-green-500' :*/}
      {/*                    event.status === 'current' ? 'bg-blue-500' :*/}
      {/*                      'bg-gray-300'*/}
      {/*                }`}/>*/}
      {/*                <div className="flex-1">*/}
      {/*                  <div className="flex items-center justify-between">*/}
      {/*                    <span className="text-sm font-medium">{event.action}</span>*/}
      {/*                    {event.date && (*/}
      {/*                      <span className="text-xs text-gray-500">{event.date}</span>*/}
      {/*                    )}*/}
      {/*                  </div>*/}
      {/*                  {event.status === 'current' && (*/}
      {/*                    <span className="text-xs text-blue-600">Đang thực hiện</span>*/}
      {/*                  )}*/}
      {/*                </div>*/}
      {/*              </div>*/}
      {/*            ))}*/}
      {/*          </div>*/}
      {/*        </div>*/}

      {/*        /!* Rejection Reason *!/*/}
      {/*        {selectedRequest.details.rejectionReason && (*/}
      {/*          <>*/}
      {/*            <Separator/>*/}
      {/*            <div>*/}
      {/*              <h4 className="font-semibold mb-3 text-red-600">Lý do từ chối</h4>*/}
      {/*              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">*/}
      {/*                <p className="text-sm text-red-800">{selectedRequest.details.rejectionReason}</p>*/}
      {/*              </div>*/}
      {/*            </div>*/}
      {/*          </>*/}
      {/*        )}*/}
      {/*      </div>*/}
      {/*    )}*/}
      {/*  </DialogContent>*/}
      {/*</Dialog>*/}
    </div>
  );
}
