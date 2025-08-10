export function getAccessToken(): Promise<string> {
  // This will be injected by the Auth0Provider context
  throw new Error("getAccessToken must be called within Auth0Provider context");
}
