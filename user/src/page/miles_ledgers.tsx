import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, CreditCard, Eye, Gift, Hash, Hotel, Plane, Search } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  type: string;
  description: string;
  miles: string;
  status: string;
  details?: {
    flightNumber?: string;
    route?: string;
    bookingRef?: string;
    hotelName?: string;
    nights?: number;
    location?: string;
    cardType?: string;
    merchantName?: string;
    rewardType?: string;
    validUntil?: string;
  };
}

const transactions: Transaction[] = [
  {
    id: "TXN001",
    date: "15/01/2025",
    type: "flight",
    description: "Chuyến bay VN123 - HCM đến Hà Nội",
    miles: "+1,200",
    status: "completed",
    details: {
      flightNumber: "VN123",
      route: "Tp. Hồ Chí Minh (SGN) → Hà Nội (HAN)",
      bookingRef: "ABC123XYZ"
    }
  },
  {
    id: "TXN002",
    date: "12/01/2025",
    type: "hotel",
    description: "Đặt phòng Hilton Saigon - 2 đêm",
    miles: "+800",
    status: "completed",
    details: {
      hotelName: "Hilton Saigon Hotel",
      nights: 2,
      location: "Quận 1, Tp. Hồ Chí Minh",
      bookingRef: "HLT789456"
    }
  },
  {
    id: "TXN003",
    date: "10/01/2025",
    type: "redeem",
    description: "Đổi voucher mua sắm Vincom",
    miles: "-2,500",
    status: "completed",
    details: {
      rewardType: "Voucher mua sắm Vincom 500.000đ",
      validUntil: "10/04/2025"
    }
  },
  {
    id: "TXN004",
    date: "08/01/2025",
    type: "flight",
    description: "Chuyến bay VN456 - Hà Nội đến HCM",
    miles: "+1,200",
    status: "completed",
    details: {
      flightNumber: "VN456",
      route: "Hà Nội (HAN) → Tp. Hồ Chí Minh (SGN)",
      bookingRef: "DEF456ABC"
    }
  },
  {
    id: "TXN005",
    date: "05/01/2025",
    type: "credit",
    description: "Thanh toán thẻ tín dụng Lotusmile",
    miles: "+350",
    status: "pending",
    details: {
      cardType: "Lotusmile Platinum Credit Card",
      merchantName: "Vinmart - Nguyễn Văn Cừ"
    }
  },
  {
    id: "TXN006",
    date: "02/01/2025",
    type: "bonus",
    description: "Thưởng sinh nhật thành viên Gold",
    miles: "+1,000",
    status: "completed",
    details: {
      rewardType: "Bonus sinh nhật Gold Member"
    }
  }
];

export default function MilesLedgers() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="w-5 h-5"/>;
      case 'hotel':
        return <Hotel className="w-5 h-5"/>;
      case 'credit':
        return <CreditCard className="w-5 h-5"/>;
      case 'redeem':
        return <Gift className="w-5 h-5"/>;
      default:
        return <Gift className="w-5 h-5"/>;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'flight':
        return 'from-blue-500 to-purple-600';
      case 'hotel':
        return 'from-green-500 to-blue-500';
      case 'credit':
        return 'from-orange-500 to-red-500';
      case 'redeem':
        return 'from-pink-500 to-purple-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'completed'
      ? <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100">Hoàn thành</Badge>
      : <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">Đang xử lý</Badge>;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Transaction List - Ticket Style */}
      <Card>
        <CardHeader className="pb-2 sm:pb-6">
          <CardTitle>Danh sách giao dịch</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                  <Input
                    placeholder="Tìm kiếm giao dịch..."
                    className="pl-10"
                  />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Thời gian"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="thisMonth">Tháng này</SelectItem>
                  <SelectItem value="lastMonth">Tháng trước</SelectItem>
                  <SelectItem value="thisYear">Năm nay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-lg group"
              >
                {/* Gradient Border */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${getTypeColor(transaction.type)} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                  style={{background: 'linear-gradient(90deg, transparent 0%, transparent 20%, rgba(147, 51, 234, 0.1) 50%, transparent 80%, transparent 100%)'}}/>

                {/* Ticket perforated edges */}
                <div
                  className="absolute left-0 top-1/2 w-6 h-6 bg-gray-50 rounded-full transform -translate-y-1/2 -translate-x-3 border-2 border-gray-100"/>
                <div
                  className="absolute right-0 top-1/2 w-6 h-6 bg-gray-50 rounded-full transform -translate-y-1/2 translate-x-3 border-2 border-gray-100"/>

                {/* Main content */}
                <div className="relative p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                      {/* Icon with gradient background */}
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${getTypeColor(transaction.type)} rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                        {getTypeIcon(transaction.type)}
                      </div>

                      {/* Transaction details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">{transaction.description}</h4>
                          {getStatusBadge(transaction.status)}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Hash className="w-3 h-3"/>
                            <span>{transaction.id}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3"/>
                            <span>{transaction.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Miles and action */}
                    <div className="flex items-center space-x-4 ml-4">
                      <div className="text-right">
                        <div
                          className={`font-bold text-lg ${transaction.miles.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                          {transaction.miles}
                        </div>
                        <div className="text-xs text-muted-foreground">dặm</div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-1"
                          >
                            <Eye className="w-4 h-4"/>
                            <span className="hidden sm:inline">Chi tiết</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <div
                                className={`w-8 h-8 bg-gradient-to-br ${getTypeColor(transaction.type)} rounded-lg flex items-center justify-center text-white`}>
                                {getTypeIcon(transaction.type)}
                              </div>
                              <span>Chi tiết giao dịch</span>
                            </DialogTitle>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Mã giao dịch</span>
                                  <p className="font-medium">{transaction.id}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Ngày thực hiện</span>
                                  <p className="font-medium">{transaction.date}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Số dặm</span>
                                  <p
                                    className={`font-semibold ${transaction.miles.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {transaction.miles} dặm
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Trạng thái</span>
                                  <div className="mt-1">{getStatusBadge(transaction.status)}</div>
                                </div>
                              </div>
                            </div>

                            {transaction.details && (
                              <div className="space-y-3">
                                <h4 className="font-medium">Thông tin chi tiết</h4>
                                <div className="space-y-2 text-sm">
                                  {transaction.details.flightNumber && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Số hiệu chuyến bay:</span>
                                      <span className="font-medium">{transaction.details.flightNumber}</span>
                                    </div>
                                  )}
                                  {transaction.details.route && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Tuyến đường:</span>
                                      <span className="font-medium text-right">{transaction.details.route}</span>
                                    </div>
                                  )}
                                  {transaction.details.hotelName && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Khách sạn:</span>
                                      <span className="font-medium">{transaction.details.hotelName}</span>
                                    </div>
                                  )}
                                  {transaction.details.nights && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Số đêm:</span>
                                      <span className="font-medium">{transaction.details.nights} đêm</span>
                                    </div>
                                  )}
                                  {transaction.details.location && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Địa điểm:</span>
                                      <span className="font-medium">{transaction.details.location}</span>
                                    </div>
                                  )}
                                  {transaction.details.cardType && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Loại thẻ:</span>
                                      <span className="font-medium">{transaction.details.cardType}</span>
                                    </div>
                                  )}
                                  {transaction.details.merchantName && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Merchant:</span>
                                      <span className="font-medium">{transaction.details.merchantName}</span>
                                    </div>
                                  )}
                                  {transaction.details.rewardType && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Loại thưởng:</span>
                                      <span className="font-medium">{transaction.details.rewardType}</span>
                                    </div>
                                  )}
                                  {transaction.details.validUntil && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Có hiệu lực đến:</span>
                                      <span
                                        className="font-medium text-amber-600">{transaction.details.validUntil}</span>
                                    </div>
                                  )}
                                  {transaction.details.bookingRef && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Mã đặt chỗ:</span>
                                      <span
                                        className="font-mono text-sm font-medium bg-gray-100 px-2 py-1 rounded">{transaction.details.bookingRef}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>

                {/* Decorative dashed line */}
                <div
                  className="absolute top-1/2 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent transform -translate-y-1/2 opacity-20"
                  style={{backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 5px, #9ca3af 5px, #9ca3af 10px)'}}/>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline" className="w-full sm:w-auto">
              <span>Xem thêm giao dịch</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
