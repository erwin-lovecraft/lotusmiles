import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Settings, CheckCircle, FileText } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";

export function LandingPage() {
  const { loginWithRedirect } = useAuth0();
  const { t } = useTranslation();

  const handleLogin = async () => {
    await loginWithRedirect();
  }

  return (
    <div className="min-h-svh w-full bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Lotusmile</span>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 border border-white/30"
            onClick={handleLogin}
          >
            {t('auth.login')}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-6">
            {t('landing.title')}
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('landing.subtitle')}
          </p>
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 rounded-lg px-8 py-3 text-lg"
            onClick={handleLogin}
          >
            {t('auth.loginNow')}
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {t('landing.features')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-white">{t('landing.manageRequests')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/80 text-center">
                  {t('landing.manageRequestsDesc')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-white">{t('landing.approveReject')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/80 text-center">
                  {t('landing.approveRejectDesc')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-white">{t('landing.recordTransactions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/80 text-center">
                  {t('landing.recordTransactionsDesc')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
