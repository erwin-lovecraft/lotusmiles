import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";

import App from "./App";
import { ThemeProvider } from "@/components/theme-provider";
import { config } from "@/config/env";

import "./index.css";
import { Provider } from "react-redux";
import { store } from "@/app/store.ts";

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

const root = createRoot(container);

root.render(
  <StrictMode>
    <Provider store={store}>
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
    </Provider>
  </StrictMode>
);
