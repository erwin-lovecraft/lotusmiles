import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AnalyticsPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5" />
          <span>{t('analytics.title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-center py-8">
          {t('analytics.description')}
        </p>
      </CardContent>
    </Card>
  )
}
