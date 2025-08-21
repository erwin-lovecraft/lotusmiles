import { Award, Calendar, TrendingUp, Loader2, User, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import { MemberTier, type Tier } from "@/lib/member-tier.ts";
import MemberTierCard from "@/components/member-tier-card.tsx";
import { useProfile } from "@/lib/services/profile";
import { format } from "date-fns";

export default function HomePage() {
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-full">
        {/* Loading State */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col items-center justify-center py-8 sm:py-12">
            <div className="relative">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <div className="absolute inset-0 rounded-full border-2 border-purple-200 animate-ping"></div>
            </div>
            <p className="mt-4 text-base sm:text-lg font-medium text-gray-700">Loading your profile...</p>
            <p className="mt-2 text-sm text-gray-500">Please wait while we fetch your data</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-6 max-w-full">
        {/* Error State */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col items-center justify-center py-8 sm:py-12">
            <div className="p-3 bg-red-100 rounded-full mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Failed to load profile</h3>
            <p className="text-sm text-gray-500 text-center max-w-md">
              We encountered an error while loading your profile. Please try refreshing the page or contact support if the problem persists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate member data from profile
  const memberData = {
    name: `${profile.first_name} ${profile.last_name}`,
    memberId: `LM${profile.id.toString().slice(-9)}`,
    currentTier: profile.member_tier as Tier,
    memberSince: new Date(profile.created_at),
    validThrough: new Date(new Date().getFullYear() + 1, 11, 31), // End of next year
    currentMiles: profile.qualifying_miles_total + profile.bonus_miles_total,
    expiringMiles: 0, // This would come from a separate API call
    expiringDate: new Date(new Date().getFullYear() + 1, 11, 31),
    tierReviewPeriod: `${format(new Date(), "MM/dd/yyyy")} - ${format(new Date(new Date().getFullYear() + 1, 11, 31), "MM/dd/yyyy")}`,
    qualifyingMiles: profile.qualifying_miles_total,
    tierFlights: 0, // This would come from a separate API call
  };

  const tierKeys = Object.keys(MemberTier) as Array<keyof typeof MemberTier>;
  const currentTierIndex = tierKeys.indexOf(memberData.currentTier);
  const nextTier = currentTierIndex < tierKeys.length - 1 ? tierKeys[currentTierIndex + 1] : null;
  const nextTierConfig = nextTier ? MemberTier[nextTier] : null;

  // Calculate progress to next tier
  const progressToNextTier = nextTierConfig ?
    Math.min((memberData.qualifyingMiles / nextTierConfig.requirements.miles) * 100, 100) : 100;

  const flightProgressToNextTier = nextTierConfig ?
    Math.min((memberData.tierFlights / nextTierConfig.requirements.flights) * 100, 100) : 100;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Membership Card */}
      <div className="min-h-[20vh] w-full grid place-items-center md:bg-neutral-100 md:p-4">
        <div className="w-full max-w-[390px]">
          <MemberTierCard
            name={memberData.name}
            memberId={memberData.memberId}
            tier={memberData.currentTier as Tier}
            memberSince={memberData.memberSince}
            validThrough={memberData.validThrough}
            issuer="Apollo Team"
          />
        </div>
      </div>

      {/* Miles Information - Material Design */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold">Miles Overview</h2>
          </div>
          <p className="text-purple-100 text-sm">Track your mileage balance and earnings</p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Total Miles */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Total</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-1">
                {memberData.currentMiles.toLocaleString()}
              </p>
              <p className="text-sm text-emerald-600">Reward Miles</p>
            </div>

            {/* Qualifying Miles */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-medium text-purple-700 uppercase tracking-wide">Qualifying</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-purple-700 mb-1">
                {profile.qualifying_miles_total.toLocaleString()}
              </p>
              <p className="text-sm text-purple-600">Flight Miles</p>
            </div>

            {/* Bonus Miles */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">Bonus</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-blue-700 mb-1">
                {profile.bonus_miles_total.toLocaleString()}
              </p>
              <p className="text-sm text-blue-600">Extra Miles</p>
            </div>

            {/* Tier Period */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gray-500 rounded-lg">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">Period</span>
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                {format(new Date(), "MMM yyyy")} - {format(new Date(new Date().getFullYear() + 1, 11, 31), "MMM yyyy")}
              </p>
              <p className="text-sm text-gray-600">Tier Review</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-gray-400 rounded-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{memberData.name}</p>
                  <p className="text-xs text-gray-500">Member</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-gray-400 rounded-lg">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{profile.email}</p>
                  <p className="text-xs text-gray-500">Email</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Upgrade Requirements */}
      {nextTierConfig && (
        <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 bg-gradient-to-br ${nextTierConfig.gradient} ${nextTierConfig.outline} rounded-lg flex items-center justify-center text-white ${nextTierConfig.shadow}`}>
                <nextTierConfig.icon className="w-4 h-4" />
              </div>
              <span>Upgrade to {nextTierConfig.label} Tier</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Miles Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Qualifying Miles</span>
                  <span className="text-sm text-muted-foreground">
                    {memberData.qualifyingMiles.toLocaleString()} / {nextTierConfig.requirements.miles.toLocaleString()}
                  </span>
                </div>
                <Progress value={progressToNextTier} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Need {(nextTierConfig.requirements.miles - memberData.qualifyingMiles).toLocaleString()} more miles
                </p>
              </div>

              {/* Flights Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Number of Flights</span>
                  <span className="text-sm text-muted-foreground">
                    {memberData.tierFlights} / {nextTierConfig.requirements.flights}
                  </span>
                </div>
                <Progress value={flightProgressToNextTier} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Need {nextTierConfig.requirements.flights - memberData.tierFlights} more flights
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Benefits when upgrading to {nextTierConfig.label}:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Priority check-in and boarding</li>
                  <li>• Increased free checked baggage allowance</li>
                  <li>• Premium airport lounge access</li>
                  <li>• Higher bonus miles earning rate</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
