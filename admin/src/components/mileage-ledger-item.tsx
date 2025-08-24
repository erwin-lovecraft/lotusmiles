import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, User } from "lucide-react";
import type { MileageLedger } from "@/types/mileage-ledger";

interface MileageLedgerItemProps {
  ledger: MileageLedger;
}

export function MileageLedgerItem({ ledger }: MileageLedgerItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalMiles = ledger.qualifying_miles_delta + ledger.bonus_miles_delta;
  const isPositive = ledger.qualifying_miles_delta >= 0;

  // Theme colors based on qualifying miles delta
  const themeColors = {
    border: isPositive ? 'border-l-green-500' : 'border-l-red-500',
    badge: isPositive
      ? 'bg-green-100 text-green-800 border-green-300'
      : 'bg-red-100 text-red-800 border-red-300',
    qualifyingMiles: isPositive ? 'text-green-600' : 'text-red-600',
    bonusMiles: 'text-blue-600',
    totalMiles: isPositive ? 'text-green-700' : 'text-red-700',
    totalIcon: isPositive ? 'text-green-500' : 'text-red-500',
    detailBg: isPositive ? 'bg-green-50' : 'bg-red-50',
    detailTitle: isPositive ? 'text-green-800' : 'text-red-800',
    detailText: isPositive ? 'text-green-700' : 'text-red-700',
    detailFooter: isPositive ? 'text-green-600' : 'text-red-600',
  };

  return (
    <Card className={`border-l-4 ${themeColors.border}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <div>
                <span className="font-medium">Khách hàng #{ledger.customer_id.toString()}</span>
                <p className="text-xs text-gray-500">ID: {ledger.customer_id.toString()}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge className={themeColors.badge}>
              {isPositive ? 'Đã ghi nhận' : 'Đã trừ'}
            </Badge>
            <p className="text-sm text-gray-600 mt-1">
              Ngày: {formatDate(ledger.created_at)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{formatDate(ledger.created_at)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`font-medium ${themeColors.qualifyingMiles}`}>
              {isPositive ? '+' : ''}{ledger.qualifying_miles_delta.toLocaleString()} dặm cơ bản
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`font-medium ${themeColors.bonusMiles}`}>
              +{ledger.bonus_miles_delta.toLocaleString()} dặm thưởng
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Plus className={`w-4 h-4 ${themeColors.totalIcon}`} />
            <span className={`font-bold ${themeColors.totalMiles}`}>
              {totalMiles >= 0 ? '+' : ''}{totalMiles.toLocaleString()} dặm tổng
            </span>
          </div>
        </div>

        <div className={`${themeColors.detailBg} p-3 rounded text-sm`}>
          <p className={`font-medium ${themeColors.detailTitle} mb-1`}>Chi tiết giao dịch:</p>
          <div className={`grid grid-cols-2 gap-4 ${themeColors.detailText}`}>
            <div>
              <span className="font-medium">Dặm cơ bản:</span> {ledger.qualifying_miles_delta.toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Dặm thưởng:</span> {ledger.bonus_miles_delta.toLocaleString()}
            </div>
          </div>
          <p className={`${themeColors.detailFooter} text-xs mt-2`}>
            {ledger.accrual_request_id ? `Yêu cầu tích dặm: #${ledger.accrual_request_id.toString()}` : "Hết hạn sử dụng"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
