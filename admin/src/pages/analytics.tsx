import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5"/>
          <span>Báo cáo & Thống kê</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-center py-8">
          Tính năng báo cáo và thống kê sẽ được phát triển trong phiên bản tới.
        </p>
      </CardContent>
    </Card>
  )
}
