import { useAuth0 } from "@auth0/auth0-react";
import { Link, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";

export default function AuthErrorPage() {
  const [params] = useSearchParams();
  const code = params.get("code") || "unknown_error";
  const message = params.get("message") || "Something went wrong";
  const { logout, loginWithRedirect } = useAuth0();
  const { t } = useTranslation();

  return (
    <div className="max-w-md mx-auto mt-16 p-6 rounded-2xl border bg-white shadow-sm">
      <h1 className="text-xl font-semibold mb-2">{t('auth.cannotSignIn')}</h1>
      <p className="text-sm text-gray-700 mb-1">Code: <span className="font-mono">{code}</span></p>
      <p className="text-sm text-gray-700 mb-4">{decodeURIComponent(message)}</p>

      {code === "access_denied" ? (
        <div className="space-y-2 text-sm">
          <p>{t('auth.adminOnly')}</p>
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="px-3 py-2 rounded-lg border hover:bg-gray-50"
          >
            {t('auth.backToLanding')}
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => loginWithRedirect({ authorizationParams: { prompt: "login" } })}
            className="px-3 py-2 rounded-lg bg-black text-white"
          >
            {t('auth.tryAgain')}
          </button>
          <Link to="/" className="px-3 py-2 rounded-lg border hover:bg-gray-50">{t('auth.goHome')}</Link>
        </div>
      )}
    </div>
  );
}
