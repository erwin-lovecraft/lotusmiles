// src/pages/callback.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";

export default function CallbackPage() {
  const { handleRedirectCallback } = useAuth0();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const error = params.get("error");
    const desc = params.get("error_description") || "Authentication failed";

    // If Auth0 throw error (e.g. access_denied from Action)
    if (error) {
      navigate(
        `/auth-error?code=${encodeURIComponent(error)}&message=${encodeURIComponent(desc)}`,
        { replace: true }
      );
      return;
    }

    (async () => {
      try {
        await handleRedirectCallback();
        navigate("/home", { replace: true });
      } catch (e: unknown) {
        navigate(
          `/auth-error?code=callback_error&message=${encodeURIComponent((e as Error).message|| "Unknown error")}`,
          { replace: true }
        );
      }
    })();
  }, []);

  return (
    <div className="flex items-center justify-center h-72">
      <div className="animate-pulse text-sm text-gray-500">Signing you in…</div>
    </div>
  );
}
