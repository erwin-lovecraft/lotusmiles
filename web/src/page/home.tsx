import { Award, Calendar, Clock, Crown, Diamond, Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import MemberCard from "@/components/member-card.tsx";

// Mock member data
const memberData = {
  name: "Nguyễn Văn An",
  memberId: "LM123456789",
  currentTier: "million_miles" as keyof typeof membershipTiers,
  memberSince: new Date(2019,12,5,0,0,0,0),
  validThrough: new Date(2025,31,12,0,0,0,0),
  currentMiles: 15420,
  expiringMiles: 2500,
  expiringDate: new Date(2025,31,12,0,0,0,0),
  tierReviewPeriod: "01/01/2025 - 31/12/2025",
  qualifyingMiles: 38750,
  tierFlights: 6
};

// Mock Membership tier configuration
const membershipTiers = {
  register: {
    name: "Register",
    color: "from-gray-400 to-gray-600",
    bgColor: "bg-gradient-to-br from-gray-100 to-gray-200",
    textColor: "text-gray-800",
    icon: Star,
    requirements: {miles: 0, flights: 0}
  },
  silver: {
    name: "Silver",
    color: "from-gray-500 to-slate-600",
    bgColor: "bg-gradient-to-br from-slate-200 to-slate-300",
    textColor: "text-slate-800",
    icon: Star,
    requirements: {miles: 25000, flights: 4}
  },
  gold: {
    name: "Gold",
    color: "from-yellow-500 to-amber-600",
    bgColor: "bg-gradient-to-br from-yellow-100 to-amber-200",
    textColor: "text-amber-900",
    icon: Award,
    requirements: {miles: 50000, flights: 8}
  },
  platinum: {
    name: "Platinum",
    color: "from-purple-600 to-indigo-700",
    bgColor: "bg-gradient-to-br from-purple-100 to-indigo-200",
    textColor: "text-purple-900",
    icon: Crown,
    requirements: {miles: 75000, flights: 12}
  },
  million_miles: {
    name: "Million Miles",
    color: "from-rose-600 to-pink-700",
    bgColor: "bg-gradient-to-br from-rose-100 to-pink-200",
    textColor: "text-rose-900",
    icon: Diamond,
    requirements: {miles: 1000000, flights: 100}
  }
};

export default function HomePage() {
  // const currentTierConfig = membershipTiers[memberData.currentTier];

  const tierKeys = Object.keys(membershipTiers) as Array<keyof typeof membershipTiers>;
  const currentTierIndex = tierKeys.indexOf(memberData.currentTier);
  const nextTier = currentTierIndex < tierKeys.length - 1 ? tierKeys[currentTierIndex + 1] : null;
  const nextTierConfig = nextTier ? membershipTiers[nextTier] : null;

  // Calculate progress to next tier
  const progressToNextTier = nextTierConfig ?
    Math.min((memberData.qualifyingMiles / nextTierConfig.requirements.miles) * 100, 100) : 100;

  const flightProgressToNextTier = nextTierConfig ?
    Math.min((memberData.tierFlights / nextTierConfig.requirements.flights) * 100, 100) : 100;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Membership Card */}
      <div className="min-h-[20vh] w-full grid place-items-center md:bg-neutral-100 md:p-4">
        <div className="w-full max-w-[390px] sm:max-w-[720px]">
          <MemberCard name={memberData.name}
                      memberID={memberData.memberId}
                      currentTier={memberData.currentTier}
                      memberSince={memberData.memberSince}
                      validThrough={memberData.validThrough}
                      expiringDate={memberData.expiringDate}/>
        </div>
      </div>

      {/* Miles Information */}
      <Card>
        <CardContent className="p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Dặm thưởng hiện tại</p>
              <p className="text-2xl font-bold text-emerald-600">{memberData.currentMiles.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-600"/>
          </div>

          <Separator className="w-8 h-8"/>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Dặm hết hạn</p>
              <p className="text-2xl font-bold text-amber-600">{memberData.expiringMiles.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Hết hạn: {memberData.expiringDate.toDateString()}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-600"/>
          </div>

          <Separator/>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Kỳ xét hạng hiện tại</p>
              <p className="text-sm font-medium text-gray-900">{memberData.tierReviewPeriod}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600"/>
          </div>

          <Separator/>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng dặm xét hạng</p>
              <p className="text-2xl font-bold text-purple-600">{memberData.qualifyingMiles.toLocaleString()}</p>
            </div>
            <Award className="w-8 h-8 text-purple-600"/>
          </div>
        </CardContent>
      </Card>

      {/* Tier Upgrade Requirements */}
      {nextTierConfig && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 bg-gradient-to-br ${nextTierConfig.color} rounded-lg flex items-center justify-center text-white`}>
                <nextTierConfig.icon className="w-4 h-4"/>
              </div>
              <span>Nâng cấp lên hạng {nextTierConfig.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Miles Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Dặm xét hạng</span>
                  <span className="text-sm text-muted-foreground">
                    {memberData.qualifyingMiles.toLocaleString()} / {nextTierConfig.requirements.miles.toLocaleString()}
                  </span>
                </div>
                <Progress value={progressToNextTier} className="h-2"/>
                <p className="text-xs text-muted-foreground mt-1">
                  Còn thiếu {(nextTierConfig.requirements.miles - memberData.qualifyingMiles).toLocaleString()} dặm
                </p>
              </div>

              {/* Flights Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Số chuyến bay</span>
                  <span className="text-sm text-muted-foreground">
                    {memberData.tierFlights} / {nextTierConfig.requirements.flights}
                  </span>
                </div>
                <Progress value={flightProgressToNextTier} className="h-2"/>
                <p className="text-xs text-muted-foreground mt-1">
                  Còn thiếu {nextTierConfig.requirements.flights - memberData.tierFlights} chuyến bay
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Quyền lợi khi nâng cấp lên {nextTierConfig.name}:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Ưu tiên check-in và lên máy bay</li>
                  <li>• Tăng hành lý ký gửi miễn phí</li>
                  <li>• Phòng chờ sân bay cao cấp</li>
                  <li>• Bonus dặm thưởng cao hơn</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Tier Cards Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Các hạng thành viên Lotusmiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(membershipTiers).map(([key, tier]) => {
              const TierIcon = tier.icon;
              const isCurrentTier = key === memberData.currentTier;

              return (
                <div
                  key={key}
                  className={`relative p-4 rounded-xl transition-all duration-200 ${tier.bgColor} ${
                    isCurrentTier ? 'ring-2 ring-purple-500 ring-offset-2 scale-105' : 'hover:scale-102'
                  }`}
                >
                  {isCurrentTier && (
                    <div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}

                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-10 rounded-xl`}/>

                  <div className="relative text-center">
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${tier.color} rounded-lg flex items-center justify-center text-white shadow-lg mx-auto mb-3`}>
                      <TierIcon className="w-5 h-5"/>
                    </div>
                    <h3 className={`font-semibold ${tier.textColor} mb-1`}>{tier.name}</h3>
                    <div className="text-xs space-y-1">
                      <p className={`${tier.textColor} opacity-70`}>
                        {tier.requirements.miles.toLocaleString()} dặm
                      </p>
                      <p className={`${tier.textColor} opacity-70`}>
                        {tier.requirements.flights} chuyến bay
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
