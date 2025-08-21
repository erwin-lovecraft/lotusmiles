import type { MileageTransaction } from "@/types/mileage-ledgers.ts";
import { CreditCard, Eye, Gift, Hash, Hotel, Plane, TrendingUp, TrendingDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { format } from "date-fns";

export type TransactionPreviewProps = {
  id: string;
  data: MileageTransaction;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'flight':
      return 'from-blue-500 to-blue-600';
    case 'hotel':
      return 'from-green-500 to-green-600';
    case 'credit_card':
      return 'from-purple-500 to-purple-600';
    case 'gift':
      return 'from-pink-500 to-pink-600';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'flight':
      return <Plane className="w-6 h-6" />;
    case 'hotel':
      return <Hotel className="w-6 h-6" />;
    case 'credit_card':
      return <CreditCard className="w-6 h-6" />;
    case 'gift':
      return <Gift className="w-6 h-6" />;
    default:
      return <Hash className="w-6 h-6" />;
  }
};

const getTransactionType = (data: MileageTransaction) => {
  // Determine transaction type based on the data
  if (data.qualifying_miles_delta > 0 && data.bonus_miles_delta > 0) {
    return 'flight';
  } else if (data.qualifying_miles_delta < 0) {
    return 'credit_card';
  } else {
    return 'gift';
  }
};

export default function TransactionPreview(props: TransactionPreviewProps) {
  const { data } = props;
  const transactionType = getTransactionType(data);
  const isPositive = data.qualifying_miles_delta > 0 || data.bonus_miles_delta > 0;

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out overflow-hidden">
      {/* Status indicator bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} />

      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                Transaction #{data.id}
              </h3>
              <Badge variant="outline" className={`${isPositive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {isPositive ? 'Credit' : 'Debit'}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                {isPositive ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
                <span>Mileage {isPositive ? 'Accrual' : 'Redemption'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Qualifying Miles
              </p>
              <p className={`text-lg sm:text-xl font-bold ${data.qualifying_miles_delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.qualifying_miles_delta >= 0 ? '+' : ''}{data.qualifying_miles_delta.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Bonus Miles
              </p>
              <p className={`text-lg sm:text-xl font-bold ${data.bonus_miles_delta >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                {data.bonus_miles_delta >= 0 ? '+' : ''}{data.bonus_miles_delta.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Additional info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 text-sm text-gray-600">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1">
                <span className="text-gray-400">📅</span>
                <span className="truncate">{format(new Date(data.created_at), "MMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-400">🆔</span>
                <span className="truncate">Request #{data.accrual_request_id}</span>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="group-hover:bg-purple-50 group-hover:border-purple-200 group-hover:text-purple-700 transition-colors w-full sm:w-auto"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${getTypeColor(transactionType).replace('from-', 'bg-').replace(' to-', '')}`}>
                      {getTypeIcon(transactionType)}
                    </div>
                    <span>Transaction Detail</span>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Transaction ID</p>
                        <p className="text-lg font-semibold text-gray-900 break-all">{data.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Customer ID</p>
                        <p className="text-lg font-semibold text-gray-900 break-all">{data.customer_id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Accrual Request ID</p>
                        <p className="text-lg font-semibold text-gray-900 break-all">{data.accrual_request_id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Transaction Date</p>
                        <p className="text-lg font-semibold text-gray-900">{format(new Date(data.created_at), "MMM dd, yyyy 'at' HH:mm")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Miles Information */}
                  <div className="bg-purple-50 rounded-xl p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Miles Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-purple-200">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Qualifying Miles</p>
                        <p className={`text-2xl font-bold ${data.qualifying_miles_delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {data.qualifying_miles_delta >= 0 ? '+' : ''}{data.qualifying_miles_delta.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-purple-200">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Bonus Miles</p>
                        <p className={`text-2xl font-bold ${data.bonus_miles_delta >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                          {data.bonus_miles_delta >= 0 ? '+' : ''}{data.bonus_miles_delta.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Summary */}
                  <div className="bg-blue-50 rounded-xl p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Summary</h3>
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Total Miles Change</span>
                        <span className={`text-lg font-bold ${(data.qualifying_miles_delta + data.bonus_miles_delta) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {(data.qualifying_miles_delta + data.bonus_miles_delta) >= 0 ? '+' : ''}{(data.qualifying_miles_delta + data.bonus_miles_delta).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
