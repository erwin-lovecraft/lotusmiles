import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import {
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  FileText,
  Filter,
  MapPin,
  MessageSquare,
  Paperclip,
  Plane,
  Search,
  Shield,
  User
} from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Separator } from "@/components/ui/separator.tsx";

// Enhanced mock data with email addresses
const mockRequests = [
  {
    // Basic ticket info
    ticketId: "TK-2024-001",
    requestDate: "2024-01-15",
    status: "pending",
    requestedBy: "Nguyễn Văn A",
    email: "nguyen.a@email.com",
    memberId: "LM123456789",

    // Detailed request info
    requestType: "Manual Miles Accrual",
    details: "Yêu cầu tích dặm cho chuyến bay VN123 từ HAN đến SGN",
    reasonFromMember: "Không nhận được dặm sau khi hoàn thành chuyến bay. Đã kiểm tra tài khoản nhiều lần nhưng dặm chưa được cộng.",
    attachments: [
      {name: "boarding_pass_VN123.pdf", type: "Boarding Pass"},
      {name: "e_ticket_VN123.pdf", type: "E-ticket"}
    ],

    // Flight details
    flightNumber: "VN123",
    route: "HAN - SGN",
    flightDate: "2024-01-10",
    miles: 1250,

    // Verification checklist
    verificationChecklist: [
      {item: "PNR hợp lệ", status: "checked"},
      {item: "Vé đã sử dụng", status: "checked"},
      {item: "Hội viên đủ điều kiện", status: "pending"},
      {item: "Boarding pass hợp lệ", status: "checked"}
    ],

    // System info
    auditLog: [
      {date: "2024-01-15 09:30", action: "Ticket created", by: "System"},
      {date: "2024-01-15 10:15", action: "Documents uploaded", by: "Nguyễn Văn A"}
    ],
    notes: "Khách hàng VIP, ưu tiên xử lý",
    statusHistory: [
      {status: "submitted", date: "2024-01-15 09:30", by: "Nguyễn Văn A"},
      {status: "under_review", date: "2024-01-15 14:20", by: "Admin System"}
    ]
  },
  {
    // Basic ticket info
    ticketId: "TK-2024-002",
    requestDate: "2024-01-14",
    status: "pending",
    requestedBy: "Trần Thị B",
    email: "tran.b@email.com",
    memberId: "LM987654321",

    // Detailed request info
    requestType: "Reward Redemption",
    details: "Yêu cầu đổi 25,000 dặm lấy vé khuyến mãi SGN-DAD",
    reasonFromMember: "Muốn sử dụng dặm tích lũy để đổi vé máy bay cho kỳ nghỉ gia đình.",
    attachments: [
      {name: "redemption_request.pdf", type: "Redemption Form"}
    ],

    // Flight details
    flightNumber: "VN456",
    route: "SGN - DAD",
    flightDate: "2024-02-15",
    miles: 25000,

    // Verification checklist
    verificationChecklist: [
      {item: "Tài khoản đủ dặm", status: "checked"},
      {item: "Chuyến bay còn chỗ", status: "pending"},
      {item: "Thông tin hành khách chính xác", status: "checked"},
      {item: "Điều kiện đổi thưởng", status: "checked"}
    ],

    // System info
    auditLog: [
      {date: "2024-01-14 14:25", action: "Redemption request created", by: "System"},
      {date: "2024-01-14 14:30", action: "Miles balance verified", by: "System"}
    ],
    notes: "Yêu cầu đổi thưởng trong thời gian cao điểm",
    statusHistory: [
      {status: "submitted", date: "2024-01-14 14:25", by: "Trần Thị B"}
    ]
  },
  {
    // Basic ticket info
    ticketId: "TK-2024-003",
    requestDate: "2024-01-13",
    status: "approved",
    requestedBy: "Lê Văn C",
    email: "le.c@email.com",
    memberId: "LM456789123",

    // Detailed request info
    requestType: "Manual Miles Accrual",
    details: "Chuyển dặm từ hãng hàng không đối tác",
    reasonFromMember: "Đã bay với hãng đối tác nhưng dặm chưa được chuyển tự động.",
    attachments: [
      {name: "partner_boarding_pass.pdf", type: "Partner Boarding Pass"},
      {name: "partner_invoice.pdf", type: "Invoice"}
    ],

    // Flight details
    flightNumber: "QF789",
    route: "SYD - HAN",
    flightDate: "2024-01-05",
    miles: 1500,

    // Decision info
    decisionDate: "2024-01-13 16:45",
    decisionBy: "Admin Nguyễn Thị D",
    reasonForDecision: "Đã xác minh thông tin chuyến bay với hãng đối tác. Dặm hợp lệ.",

    // System info
    auditLog: [
      {date: "2024-01-13 09:15", action: "Ticket created", by: "System"},
      {date: "2024-01-13 10:30", action: "Partner verification completed", by: "System"},
      {date: "2024-01-13 16:45", action: "Approved by admin", by: "Admin Nguyễn Thị D"}
    ],
    notes: "Hãng đối tác Qantas - đã xác minh",
    statusHistory: [
      {status: "submitted", date: "2024-01-13 09:15", by: "Lê Văn C"},
      {status: "under_review", date: "2024-01-13 10:00", by: "System"},
      {status: "approved", date: "2024-01-13 16:45", by: "Admin Nguyễn Thị D"}
    ]
  },
  {
    // Basic ticket info
    ticketId: "TK-2024-004",
    requestDate: "2024-01-12",
    status: "rejected",
    requestedBy: "Phạm Thị D",
    email: "pham.d@email.com",
    memberId: "LM555666777",

    // Detailed request info
    requestType: "Manual Miles Accrual",
    details: "Yêu cầu tích dặm cho chuyến bay đã hủy",
    reasonFromMember: "Chuyến bay bị hủy nhưng tôi muốn được tích dặm.",
    attachments: [
      {name: "cancelled_ticket.pdf", type: "E-ticket"}
    ],

    // Flight details
    flightNumber: "VN999",
    route: "HAN - HCM",
    flightDate: "2024-01-08",
    miles: 1000,

    // Decision info
    decisionDate: "2024-01-12 10:30",
    decisionBy: "Admin Nguyễn Thị D",
    reasonForDecision: "Chuyến bay đã hủy, không đủ điều kiện tích dặm.",

    // Verification checklist
    verificationChecklist: [
      {item: "PNR hợp lệ", status: "checked"},
      {item: "Vé đã sử dụng", status: "failed"},
      {item: "Hội viên đủ điều kiện", status: "failed"}
    ],

    // System info
    auditLog: [
      {date: "2024-01-12 09:15", action: "Ticket created", by: "System"},
      {date: "2024-01-12 10:30", action: "Rejected by admin", by: "Admin Nguyễn Thị D"}
    ],
    notes: "Chuyến bay hủy bỏ",
    statusHistory: [
      {status: "submitted", date: "2024-01-12 09:15", by: "Phạm Thị D"},
      {status: "rejected", date: "2024-01-12 10:30", by: "Admin Nguyễn Thị D"}
    ]
  }
];
const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Đang chờ</Badge>;
    case "approved":
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Đã duyệt</Badge>;
    case "rejected":
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Từ chối</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getVerificationStatusIcon = (status: string) => {
  switch (status) {
    case "checked":
      return <CheckCircle className="w-4 h-4 text-green-600"/>;
    case "pending":
      return <Clock className="w-4 h-4 text-yellow-600"/>;
    case "failed":
      return <span className="w-4 h-4 text-red-600">✕</span>;
    default:
      return <Clock className="w-4 h-4 text-gray-400"/>;
  }
};

export default function HomePage() {
  const [expandedTickets, setExpandedTickets] = useState<Set<string>>(new Set());

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Filter requests based on search and filters
  const filteredRequests = mockRequests.filter(request => {
    const matchesSearch =
      request.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || request.status === statusFilter;

    const matchesDate = !dateFilter || request.requestDate.includes(dateFilter);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const toggleTicketExpansion = (ticketId: string) => {
    const newExpanded = new Set(expandedTickets);
    if (newExpanded.has(ticketId)) {
      newExpanded.delete(ticketId);
    } else {
      newExpanded.add(ticketId);
    }
    setExpandedTickets(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5"/>
            <span>Bộ lọc</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm">Tìm kiếm</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                <Input
                  placeholder="Ticket ID, tên, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm">Trạng thái</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Đang chờ</SelectItem>
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
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setDateFilter("");
                }}
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
          Hiển thị {filteredRequests.length} trong tổng số {mockRequests.length} yêu cầu
        </p>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.ticketId} className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              {/* Basic ticket info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500"/>
                    <div>
                      <span className="font-medium">{request.requestedBy}</span>
                      <p className="text-xs text-gray-500">{request.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{request.ticketId}</Badge>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(request.status)}
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center space-x-1"
                    onClick={() => toggleTicketExpansion(request.ticketId)}
                  >
                    {expandedTickets.has(request.ticketId) ? (
                      <>
                        <EyeOff className="w-4 h-4"/>
                        <span>Thu gọn</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4"/>
                        <span>Chi tiết</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Basic flight info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Plane className="w-4 h-4 text-gray-500"/>
                  <span>{request.flightNumber}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500"/>
                  <span>{request.route}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500"/>
                  <span>{request.flightDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-purple-600">{request.miles.toLocaleString()} dặm</span>
                </div>
              </div>

              <p className="text-gray-600 mt-3 text-sm">{request.reasonFromMember}</p>

              {/* Expanded Details */}
              {expandedTickets.has(request.ticketId) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  {/* Basic Ticket Information */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="text-lg px-3 py-1">{request.ticketId}</Badge>
                      <div>
                        <p className="font-medium text-lg">{request.requestedBy}</p>
                        <p className="text-sm text-gray-600">Member ID: {request.memberId}</p>
                        <p className="text-sm text-gray-600">Email: {request.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(request.status)}
                      <p className="text-sm text-gray-600 mt-1">Ngày gửi: {request.requestDate}</p>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Thông tin yêu cầu</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Loại yêu cầu:</span>
                            <span className="font-medium">{request.requestType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Chi tiết:</span>
                            <span className="font-medium text-right max-w-48">{request.details}</span>
                          </div>
                          {request.flightNumber && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Chuyến bay:</span>
                                <span className="font-medium">{request.flightNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tuyến:</span>
                                <span className="font-medium">{request.route}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Ngày bay:</span>
                                <span className="font-medium">{request.flightDate}</span>
                              </div>
                            </>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Số dặm:</span>
                            <span className="font-medium text-purple-600">{request.miles.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Attachments */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                          <Paperclip className="w-4 h-4 mr-2"/>
                          File đính kèm
                        </h4>
                        <div className="space-y-1">
                          {request.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm bg-gray-50 p-2 rounded">
                              <FileText className="w-4 h-4 text-gray-400"/>
                              <span>{attachment.name}</span>
                              <Badge variant="outline" className="text-xs">{attachment.type}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Verification Checklist */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                          <Shield className="w-4 h-4 mr-2"/>
                          Danh sách xác minh
                        </h4>
                        <div className="space-y-2">
                          {request.verificationChecklist.map((item, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              {getVerificationStatusIcon(item.status)}
                              <span className={
                                item.status === "checked" ? "text-green-700" :
                                  item.status === "failed" ? "text-red-700" : "text-gray-600"
                              }>
                                {item.item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      {request.notes && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <MessageSquare className="w-4 h-4 mr-2"/>
                            Ghi chú nội bộ
                          </h4>
                          <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">{request.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Member Reason */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Lý do từ khách hàng:</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{request.reasonFromMember}</p>
                  </div>

                  <Separator className="my-4"/>

                  {/* Action Buttons - Only show for pending requests */}
                  {request.status === "pending" && (
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
                  {(request.status === "approved" || request.status === "rejected") && request.decisionBy && request.reasonForDecision && (
                    <div className={`p-3 rounded text-sm ${
                      request.status === "approved" ? "bg-green-50" : "bg-red-50"
                    }`}>
                      <p className={`font-medium mb-1 ${
                        request.status === "approved" ? "text-green-800" : "text-red-800"
                      }`}>
                        Quyết định {request.status === "approved" ? "phê duyệt" : "từ chối"}:
                      </p>
                      <p className={request.status === "approved" ? "text-green-700" : "text-red-700"}>
                        {request.reasonForDecision}
                      </p>
                      <p className={`text-xs mt-2 ${
                        request.status === "approved" ? "text-green-600" : "text-red-600"
                      }`}>
                        Được {request.status === "approved" ? "duyệt" : "từ chối"} bởi: {request.decisionBy}
                      </p>
                      <p className={`text-xs ${
                        request.status === "approved" ? "text-green-600" : "text-red-600"
                      }`}>
                        Ngày quyết định: {request.decisionDate}
                      </p>
                    </div>
                  )}

                  {/* Audit Log */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Lịch sử thao tác</h4>
                    <div className="space-y-2">
                      {request.auditLog.map((log, index) => (
                        <div key={index} className="flex justify-between items-center text-xs text-gray-500">
                          <span>{log.action}</span>
                          <span>{log.date} - {log.by}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
