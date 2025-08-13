import { Button } from "@/components/ui/button.tsx";
import { Calendar, Shield, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import AppBar from "@/components/appbar.tsx";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const benefits = [
  {
    icon: TrendingUp,
    title: "Accumulate Miles",
    description: "Earn points on every flight and linked activities."
  },
  {
    icon: Calendar,
    title: "Redeem Exciting Rewards",
    description: "Use points to redeem flight tickets, hotels, and many valuable gifts."
  },
  {
    icon: Shield,
    title: "Absolute Security",
    description: "Personal information is encrypted and comprehensively protected."
  }
];


export default function LandingPage() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home")
    }
  }, [isAuthenticated, navigate]);

  const handleClickGetStarted = async () => {
    await loginWithRedirect();
  }

  return (
    <>
      <AppBar />

      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="text-center space-y-6 sm:space-y-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Lotusmile Loyalty Program
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto px-2">
              Earn Points – Redeem Rewards – Enjoy Amazing Journeys
            </p>

            <div className="pt-2 sm:pt-4">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-purple-50 px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                onClick={handleClickGetStarted}
              >
                Get Started Now
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none"></div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 px-2">
              Join Now to Receive Special Offers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-0 h-full">
                  <CardContent className="p-6 sm:p-8 text-center space-y-4 flex flex-col h-full">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                      <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>

                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                      {benefit.title}
                    </h3>

                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed flex-1">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  )
}
