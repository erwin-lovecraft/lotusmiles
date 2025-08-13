import { Award, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";

const stats = [
  {
    title: "Tổng số dặm",
    value: "15,420",
    icon: TrendingUp,
    color: "text-green-600"
  },
  {
    title: "Hạng thành viên",
    value: "Gold",
    icon: Award,
    color: "text-yellow-600"
  },
];

export default function HomePage () {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Tổng quan thông tin tài khoản của bạn</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-2 lg:gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="h-full">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 leading-tight">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <IconComponent className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color} flex-shrink-0`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base truncate">Chuyến bay HCM - HN</p>
                  <p className="text-xs sm:text-sm text-gray-600">15/01/2025</p>
                </div>
                <Badge variant="secondary" className="text-xs sm:text-sm ml-2 flex-shrink-0">+1,200 dặm</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base truncate">Đặt khách sạn Hilton</p>
                  <p className="text-xs sm:text-sm text-gray-600">12/01/2025</p>
                </div>
                <Badge variant="secondary" className="text-xs sm:text-sm ml-2 flex-shrink-0">+800 dặm</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base truncate">Chuyến bay HN - SGN</p>
                  <p className="text-xs sm:text-sm text-gray-600">08/01/2025</p>
                </div>
                <Badge variant="secondary" className="text-xs sm:text-sm ml-2 flex-shrink-0">+1,200 dặm</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
