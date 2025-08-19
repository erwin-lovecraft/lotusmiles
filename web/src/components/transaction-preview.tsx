import type { MileageTransaction } from "@/types/mileage-ledgers.ts";
import { Clock, CreditCard, Eye, Gift, Hash, Hotel, Plane } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { format } from "date-fns";

export type TransactionPreviewProps = {
  id: string;
  data: MileageTransaction
}

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
}

// const getStatusBadge = (status: string) => {
//   return status === 'completed'
//     ? <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100">Hoàn thành</Badge>
//     : <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">Đang xử lý</Badge>;
// };

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

export default function TransactionPreview(props: TransactionPreviewProps) {
  const { data } = props;

  return (
    <div
      key={props.id}
      className="relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-lg group"
    >
      {/* Gradient Border */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${getTypeColor('flight')} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
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
              className={`w-12 h-12 bg-gradient-to-br ${getTypeColor('flight')} rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
              {getTypeIcon('flight')}
            </div>

            {/* Transaction details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-semibold text-gray-900 truncate">Mileage Accural Request Manual</h4>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Hash className="w-3 h-3"/>
                  <span>{data.id}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3"/>
                  <span>{format(data.created_at, 'dd/MM/yyyy')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Miles and action */}
          <div className="flex items-center space-x-4 ml-4">
            <div className="text-right">
              <div
                className={`font-bold text-lg ${data.qualifying_miles_delta.toString().startsWith('-') ? 'text-red-500' : 'text-emerald-600'}`}>
                {data.qualifying_miles_delta}
              </div>
              <div className="text-xs text-muted-foreground">miles</div>
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
                      className={`w-8 h-8 bg-gradient-to-br ${getTypeColor('flight')} rounded-lg flex items-center justify-center text-white`}>
                      {getTypeIcon('flight')}
                    </div>
                    <span>Detail</span>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">ID</span>
                        <p className="font-medium">{data.id}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Change Date</span>
                        <p className="font-medium">{format(data.created_at, 'dd/MM/yyyy')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Qualifying Miles</span>
                        <p
                          className={`font-semibold ${data.qualifying_miles_delta.toString().startsWith('-') ? 'text-red-500' : 'text-emerald-600'}`}>
                          {data.qualifying_miles_delta} miles
                        </p>
                      </div>
                    </div>
                  </div>

                  {/*{data.details && (*/}
                  {/*  <div className="space-y-3">*/}
                  {/*    <h4 className="font-medium">Thông tin chi tiết</h4>*/}
                  {/*    <div className="space-y-2 text-sm">*/}
                  {/*      {transaction.details.flightNumber && (*/}
                  {/*        <div className="flex justify-between">*/}
                  {/*          <span className="text-muted-foreground">Số hiệu chuyến bay:</span>*/}
                  {/*          <span className="font-medium">{transaction.details.flightNumber}</span>*/}
                  {/*        </div>*/}
                  {/*      )}*/}
                  {/*      {transaction.details.route && (*/}
                  {/*        <div className="flex justify-between">*/}
                  {/*          <span className="text-muted-foreground">Tuyến đường:</span>*/}
                  {/*          <span className="font-medium text-right">{transaction.details.route}</span>*/}
                  {/*        </div>*/}
                  {/*      )}*/}
                  {/*      {transaction.details.hotelName && (*/}
                  {/*        <div className="flex justify-between">*/}
                  {/*          <span className="text-muted-foreground">Khách sạn:</span>*/}
                  {/*          <span className="font-medium">{transaction.details.hotelName}</span>*/}
                  {/*        </div>*/}
                  {/*      )}*/}
                  {/*      {transaction.details.nights && (*/}
                  {/*        <div className="flex justify-between">*/}
                  {/*          <span className="text-muted-foreground">Số đêm:</span>*/}
                  {/*          <span className="font-medium">{transaction.details.nights} đêm</span>*/}
                  {/*        </div>*/}
                  {/*      )}*/}
                  {/*      {transaction.details.location && (*/}
                  {/*        <div className="flex justify-between">*/}
                  {/*          <span className="text-muted-foreground">Địa điểm:</span>*/}
                  {/*          <span className="font-medium">{transaction.details.location}</span>*/}
                  {/*        </div>*/}
                  {/*      )}*/}
                  {/*      {transaction.details.cardType && (*/}
                  {/*        <div className="flex justify-between">*/}
                  {/*          <span className="text-muted-foreground">Loại thẻ:</span>*/}
                  {/*          <span className="font-medium">{transaction.details.cardType}</span>*/}
                  {/*        </div>*/}
                  {/*      )}*/}
                  {/*      {transaction.details.merchantName && (*/}
                  {/*        <div className="flex justify-between">*/}
                  {/*          <span className="text-muted-foreground">Merchant:</span>*/}
                  {/*          <span className="font-medium">{transaction.details.merchantName}</span>*/}
                  {/*        </div>*/}
                  {/*      )}*/}
                  {/*      {transaction.details.rewardType && (*/}
                  {/*        <div className="flex justify-between">*/}
                  {/*          <span className="text-muted-foreground">Loại thưởng:</span>*/}
                  {/*          <span className="font-medium">{transaction.details.rewardType}</span>*/}
                  {/*        </div>*/}
                  {/*      )}*/}
                  {/*      {transaction.details.validUntil && (*/}
                  {/*        <div className="flex justify-between">*/}
                  {/*          <span className="text-muted-foreground">Có hiệu lực đến:</span>*/}
                  {/*          <span*/}
                  {/*            className="font-medium text-amber-600">{transaction.details.validUntil}</span>*/}
                  {/*        </div>*/}
                  {/*      )}*/}
                  {/*      {transaction.details.bookingRef && (*/}
                  {/*        <div className="flex justify-between">*/}
                  {/*          <span className="text-muted-foreground">Mã đặt chỗ:</span>*/}
                  {/*          <span*/}
                  {/*            className="font-mono text-sm font-medium bg-gray-100 px-2 py-1 rounded">{transaction.details.bookingRef}</span>*/}
                  {/*        </div>*/}
                  {/*      )}*/}
                  {/*    </div>*/}
                  {/*  </div>*/}
                  {/*)}*/}
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
  )
}
