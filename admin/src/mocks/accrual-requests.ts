export interface MockAccrualRequest {
  // Basic ticket info
  ticketId: string;
  requestDate: string;
  status: string;
  requestedBy: string;
  email: string;
  memberId: string;

  // Detailed request info
  requestType: string;
  details: string;
  reasonFromMember: string;
  attachments: Array<{name: string; type: string}>;

  // Flight details
  flightNumber: string;
  route: string;
  flightDate: string;
  miles: number;

  // Verification checklist
  verificationChecklist?: Array<{item: string; status: string}>;

  // System info
  auditLog: Array<{date: string; action: string; by: string}>;
  notes?: string;
  statusHistory: Array<{status: string; date: string; by: string}>;

  // Decision info (for approved/rejected)
  decisionDate?: string;
  decisionBy?: string;
  reasonForDecision?: string;
}

export const mockRequests: MockAccrualRequest[] = [
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
