import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from "@auth0/auth0-react";
import { config } from "@/config/env";
import '@/index.css'
import App from '@/App.tsx'
import { BrowserRouter } from "react-router";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={config.auth0.domain}
      clientId={config.auth0.clientId}
      authorizationParams={{
        redirect_uri: window.location.origin + '/callback',
        audience: config.auth0.audience,
        connection: config.auth0.connection,
      }}
      useRefreshTokens={true}
      useRefreshTokensFallback={true}
      cacheLocation="localstorage"
    >
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </Auth0Provider>
  </StrictMode>,
)
