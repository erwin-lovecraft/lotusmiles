import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import {  Calendar, Mail, MapPin, Phone, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAuth0 } from "@auth0/auth0-react";

export default function Profile() {
  const {user} = useAuth0();

  return (
    <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <User className="w-4 h-4 sm:w-5 sm:h-5"/>
                <span>Thông tin cá nhân</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 pt-0">
              {/* Avatar Section */}
              <div
                className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 pb-4 border-b text-center sm:text-left">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                  <AvatarImage
                    src={user?.picture}
                    alt={user?.name}
                  />
                  <AvatarFallback
                    className="bg-gradient-to-br from-purple-600 to-pink-500 text-white text-xl sm:text-2xl">
                    NA
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">{user?.name}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Thành viên Gold</p>
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white mt-1 text-xs sm:text-sm">
                    LM2025001234
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-2">
                  <Mail className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0"/>
                  <div className="min-w-0 flex-1">
                    <label className="text-xs sm:text-sm font-medium text-gray-700 block">Email</label>
                    <p className="mt-1 text-sm sm:text-base text-gray-900 break-all">{user?.email}</p>
                  </div>
                </div>
                {user?.phone_number &&
                  <div className="flex items-start space-x-2">
                    <Phone className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0"/>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 block">Số điện thoại</label>
                      <p className="mt-1 text-sm sm:text-base text-gray-900">{user?.phone_number || "Chưa cập nhật"}</p>
                    </div>
                  </div>
                }
                <div className="flex items-start space-x-2 sm:col-span-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0"/>
                  <div className="min-w-0 flex-1">
                    <label className="text-xs sm:text-sm font-medium text-gray-700 block">Địa chỉ</label>
                    <p className="mt-1 text-sm sm:text-base text-gray-900">{user?.address || "Chưa cập nhật"}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0"/>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700 block">Ngày sinh</label>
                    <p className="mt-1 text-sm sm:text-base text-gray-900">{user?.birthdate || "Chưa cập nhật"}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700 block">Ngày tham gia</label>
                  <p className="mt-1 text-sm sm:text-base text-gray-900">20/11/2023</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 w-full sm:w-auto text-sm sm:text-base">
                  Cập nhật thông tin
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
