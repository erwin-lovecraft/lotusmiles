import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import '@/index.css'
import { Auth0Provider } from "@auth0/auth0-react";
import { config } from "@/config/env";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { BrowserRouter } from "react-router";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import '@/i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Auth0Provider
        domain={config.auth0.domain}
        clientId={config.auth0.clientId}
        authorizationParams={{
          redirect_uri: window.location.origin + '/callback',
          audience: config.auth0.audience,
        }}
      >
        <ThemeProvider defaultTheme="light" storageKey="lotusmiles-app-theme">
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </Auth0Provider>
    </QueryClientProvider>
  </StrictMode>,
)
