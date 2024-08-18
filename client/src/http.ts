import { Api } from "./api";

// Storage key for JWT
export const TOKEN_KEY = "token";
// URL prefix for own server
// This is to protect us from accidently sending the JWT to 3rd party services.
const AUTHORIZE_ORIGIN = "/";

const _api = new Api();

_api.instance.interceptors.request.use((config) => {
  // Get token stored by `jwtAtom`
  const jwtStorage = localStorage.getItem(TOKEN_KEY);
  // Add Authorization header if we have a JWT and the request goes to our own
  // server.
  if (jwtStorage && config.url?.startsWith(AUTHORIZE_ORIGIN)) {
    // `atomWithStorage` will JSON serialize before storage.
    // So, we need to parse the value (or trim double-qoutes).
    const jwt = JSON.parse(jwtStorage);
    // Set Authorization header, so server can tell hos is logged in.
    config.headers.Authorization = `Bearer ${jwt}`;
  }
  return config;
});

// Expose API-client which will handle authorization.
export const http = _api.api;
