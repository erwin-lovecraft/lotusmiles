import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import '@/index.css'
import { Auth0Provider } from "@auth0/auth0-react";
import { config } from "@/config/env";
import { ThemeProvider } from "@/components/theme-provider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={config.auth0.domain}
      clientId={config.auth0.clientId}
      authorizationParams={{
        redirect_uri: window.location.origin + '/callback',
        audience: config.auth0.audience,
      }}
      useRefreshTokens={true}
      useRefreshTokensFallback={true}
      cacheLocation="localstorage"
    >
      <ThemeProvider defaultTheme="light" storageKey="lotusmiles-app-theme">
        <App/>
      </ThemeProvider>
    </Auth0Provider>
  </StrictMode>,
)
