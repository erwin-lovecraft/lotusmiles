import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Calendar, Mail, MapPin, Phone, User, Loader2, Award, Hash, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { useAuth0 } from "@auth0/auth0-react";
import { useProfile } from "@/lib/services/profile";
import { format } from "date-fns";
import { MemberTier, type Tier } from "@/lib/member-tier";

export default function Profile() {
  const { user } = useAuth0();
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
  };

  // Get tier color for badge
  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'silver':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'titan':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'gold':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'platinum':
        return 'bg-zinc-100 text-zinc-800 border-zinc-200';
      case 'million_miler':
        return 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Check if email and phone are verified (mock data for now)
  const emailVerified = true; // This should come from API
  const phoneVerified = profile.phone ? true : false; // Only verified if phone exists

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Profile Information Card */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="w-4 h-4 text-purple-600" />
              </div>
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 pb-4 border-b text-center sm:text-left">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                <AvatarImage
                  src={user?.picture}
                  alt={memberData.name}
                />
                <AvatarFallback
                  className="bg-gradient-to-br from-purple-600 to-pink-500 text-white text-xl sm:text-2xl">
                  {memberData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">{memberData.name}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{profile.member_tier.toUpperCase()}</p>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white mt-1 text-xs sm:text-sm">
                  {memberData.memberId}
                </Badge>
              </div>
            </div>

            {/* Personal Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 block">First Name</label>
                  <p className="mt-1 text-sm sm:text-base text-gray-900">{profile.first_name}</p>
                </div>
              </div>

              {/* Last Name */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 block">Last Name</label>
                  <p className="mt-1 text-sm sm:text-base text-gray-900">{profile.last_name}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 block">Email</label>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-sm sm:text-base text-gray-900 break-all">{profile.email}</p>
                    {emailVerified && (
                      <div className="flex items-center gap-1">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-600 font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 block">Phone</label>
                  <div className="mt-1 flex items-center gap-2">
                    {profile.phone ? (
                      <>
                        <p className="text-sm sm:text-base text-gray-900">{profile.phone}</p>
                        {phoneVerified && (
                          <div className="flex items-center gap-1">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">Verified</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Not Provided
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Member ID */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Hash className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 block">Member ID</label>
                  <p className="mt-1 text-sm sm:text-base text-gray-900">{memberData.memberId}</p>
                </div>
              </div>

              {/* Current Tier */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Award className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 block">Current Tier</label>
                  <div className="mt-1">
                    <Badge variant="outline" className={getTierBadgeColor(profile.member_tier)}>
                      {profile.member_tier.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Member Since */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 block">Member Since</label>
                  <p className="mt-1 text-sm sm:text-base text-gray-900">{format(memberData.memberSince, 'dd/MM/yyyy')}</p>
                </div>
              </div>

              {/* Valid Through */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 block">Valid Through</label>
                  <p className="mt-1 text-sm sm:text-base text-gray-900">{format(memberData.validThrough, 'dd/MM/yyyy')}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-3 sm:col-span-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MapPin className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 block">Address</label>
                  <div className="mt-1">
                    {user?.address ? (
                      <p className="text-sm sm:text-base text-gray-900">{user.address}</p>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Not Provided
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Tier Cards Preview */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle>Lotusmiles Membership Tiers</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(MemberTier).map(([key, tier]) => {
                const TierIcon = tier.icon;
                const isCurrentTier = key === memberData.currentTier;

                return (
                  <div
                    key={key}
                    className={`relative p-4 rounded-xl transition-all duration-200 bg-gradient-to-br ${tier.gradient} ${isCurrentTier ? 'ring-2 ring-purple-500 ring-offset-2 scale-105' : 'hover:scale-102'
                      }`}
                  >
                    {isCurrentTier && (
                      <div
                        className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}

                    <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-10 rounded-xl`} />

                    <div className="relative text-center">
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${tier.logoFrom} ${tier.logoTo} rounded-lg flex items-center justify-center ${tier.text} shadow-lg mx-auto mb-3`}>
                        <TierIcon className="w-5 h-5" />
                      </div>
                      <h3 className={`font-semibold ${tier.text} mb-1`}>{tier.label}</h3>
                      <div className="text-xs space-y-1">
                        <p className={`${tier.text} opacity-70`}>
                          {tier.requirements.miles.toLocaleString()} miles
                        </p>
                        <p className={`${tier.text} opacity-70`}>
                          {tier.requirements.flights} flights
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
    </div>
  );
}
