interface Config {
  auth0: {
    domain: string;
    clientId: string;
    audience: string;
    onboardedClaim: string;
  };
  api: {
    baseUrl: string;
  };
  app: {
    env: "development" | "staging" | "production";
  };
}

function validateEnv(): Config {
  const requiredVars = [
    "VITE_AUTH0_DOMAIN",
    "VITE_AUTH0_CLIENT_ID",
    "VITE_AUTH0_AUDIENCE",
    "VITE_API_BASE_URL",
    "VITE_APP_ENV",
  ] as const;

  // Check for missing required environment variables
  const missing = requiredVars.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  const env = import.meta.env.VITE_APP_ENV;
  if (!["development", "staging", "production"].includes(env)) {
    throw new Error(`Invalid VITE_APP_ENV: ${env}. Must be development, staging, or production`);
  }

  return {
    auth0: {
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      onboardedClaim: import.meta.env.VITE_AUTH0_ONBOARDED_CLAIM || "https://loyalty.yourapp.com/onboarded",
    },
    api: {
      baseUrl: import.meta.env.VITE_API_BASE_URL,
    },
    app: {
      env: env as "development" | "staging" | "production",
    },
  };
}

export const config = validateEnv();
