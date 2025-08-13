import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Award, Calendar, Mail, MapPin, Phone, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function Profile() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Thông tin thành viên</h1>
        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Quản lý thông tin cá nhân và hạng thành viên</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Thông tin cá nhân</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 pt-0">
              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 pb-4 border-b text-center sm:text-left">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
                    alt="Nguyễn Văn An"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-500 text-white text-xl sm:text-2xl">
                    NA
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Nguyễn Văn An</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Thành viên Gold</p>
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white mt-1 text-xs sm:text-sm">
                    LM2025001234
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-2">
                  <Mail className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <label className="text-xs sm:text-sm font-medium text-gray-700 block">Email</label>
                    <p className="mt-1 text-sm sm:text-base text-gray-900 break-all">nguyen.van.an@email.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Phone className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700 block">Số điện thoại</label>
                    <p className="mt-1 text-sm sm:text-base text-gray-900">+84 901 234 567</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 sm:col-span-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <label className="text-xs sm:text-sm font-medium text-gray-700 block">Địa chỉ</label>
                    <p className="mt-1 text-sm sm:text-base text-gray-900">123 Nguyễn Văn Linh, Quận 7, TP.HCM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700 block">Ngày sinh</label>
                    <p className="mt-1 text-sm sm:text-base text-gray-900">15/03/1990</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700 block">Ngày tham gia</label>
                  <p className="mt-1 text-sm sm:text-base text-gray-900">20/11/2023</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 w-full sm:w-auto text-sm sm:text-base">
                  Cập nhật thông tin
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Hạng thành viên</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="text-center">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 text-base sm:text-lg">
                  GOLD
                </Badge>
                <p className="text-xs sm:text-sm text-gray-600 mt-2">Hạng hiện tại</p>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Tiến độ lên Platinum</span>
                    <span>15,420 / 25,000 dặm</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-2 rounded-full" style={{width: '61.7%'}}></div>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-gray-600">
                  <p>Còn <span className="font-semibold text-purple-600">9,580 dặm</span> nữa để lên hạng Platinum</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2 text-sm sm:text-base">Quyền lợi Gold</h4>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                  <li>• Ưu tiên check-in</li>
                  <li>• Hành lý thêm 10kg</li>
                  <li>• Tích dặm thưởng x1.5</li>
                  <li>• Lounge miễn phí</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
