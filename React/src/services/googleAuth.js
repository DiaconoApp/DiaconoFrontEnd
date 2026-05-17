import { loginWithGoogle } from "./login";

const GOOGLE_AUTH_STORAGE_KEY = "googleAuthRequest";
const GOOGLE_SCOPE = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/calendar.events",
].join(" ");
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

const createGoogleAuthError = (message, fallbackPath = "/login") => {
  const error = new Error(message);
  error.fallbackPath = fallbackPath;
  return error;
};

const getStoredGoogleAuthRequest = () => {
  const rawValue = sessionStorage.getItem(GOOGLE_AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    sessionStorage.removeItem(GOOGLE_AUTH_STORAGE_KEY);
    return null;
  }
};

const randomString = (length = 64) => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const bytes = crypto.getRandomValues(new Uint8Array(length));

  return Array.from(bytes, (byte) => charset[byte % charset.length]).join("");
};

const base64UrlEncode = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const generatePkcePair = async () => {
  const codeVerifier = randomString(96);
  const encodedVerifier = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", encodedVerifier);

  return {
    codeVerifier,
    codeChallenge: base64UrlEncode(digest),
  };
};

const getGoogleCallbackErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "access_denied":
      return "O login com Google foi cancelado ou negado.";
    case "temporarily_unavailable":
      return "O Google está temporariamente indisponível. Tente novamente em instantes.";
    default:
      return "Não foi possível concluir a autenticação com o Google.";
  }
};

export const isGoogleAuthConfigured = () => Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

export const getGoogleRedirectUri = () =>
  import.meta.env.VITE_GOOGLE_REDIRECT_URI ?? `${window.location.origin}/auth/google/callback`;

export const isGooglePkceEnabled = () => import.meta.env.VITE_GOOGLE_USE_PKCE !== "false";

export const clearGoogleAuthorizationState = () => {
  sessionStorage.removeItem(GOOGLE_AUTH_STORAGE_KEY);
};

export const startGoogleAuthorization = async ({
  successPath = "/eventos",
  errorPath = "/login",
} = {}) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw createGoogleAuthError("Google Client ID não configurado.", errorPath);
  }

  const redirectUri = getGoogleRedirectUri();
  const state = randomString(48);
  const usePkce = isGooglePkceEnabled();
  let codeVerifier;
  let codeChallenge;

  if (usePkce) {
    const pkcePair = await generatePkcePair();
    codeVerifier = pkcePair.codeVerifier;
    codeChallenge = pkcePair.codeChallenge;
  }

  sessionStorage.setItem(
    GOOGLE_AUTH_STORAGE_KEY,
    JSON.stringify({
      state,
      redirectUri,
      successPath,
      errorPath,
      codeVerifier: codeVerifier ?? null,
      usePkce,
    })
  );

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GOOGLE_SCOPE,
    access_type: "offline",
    include_granted_scopes: "true",
    prompt: "consent",
    state,
  });

  if (usePkce && codeChallenge) {
    params.set("code_challenge", codeChallenge);
    params.set("code_challenge_method", "S256");
  }

  window.location.assign(`${GOOGLE_AUTH_URL}?${params.toString()}`);
};

export const completeGoogleAuthorization = async (search = window.location.search) => {
  const storedRequest = getStoredGoogleAuthRequest();
  const fallbackPath = storedRequest?.errorPath ?? "/login";
  const params = new URLSearchParams(search);
  const googleError = params.get("error");
  const googleErrorDescription = params.get("error_description");
  const code = params.get("code");
  const returnedState = params.get("state");

  if (!storedRequest) {
    throw createGoogleAuthError(
      "Nenhum fluxo de autenticação Google pendente foi encontrado.",
      fallbackPath
    );
  }

  if (googleError) {
    clearGoogleAuthorizationState();
    throw createGoogleAuthError(
      googleErrorDescription || getGoogleCallbackErrorMessage(googleError),
      fallbackPath
    );
  }

  if (!returnedState || returnedState !== storedRequest.state) {
    clearGoogleAuthorizationState();
    throw createGoogleAuthError(
      "A resposta do Google retornou com estado inválido. Reinicie o login.",
      fallbackPath
    );
  }

  if (!code) {
    clearGoogleAuthorizationState();
    throw createGoogleAuthError(
      "O Google não retornou um authorization code válido.",
      fallbackPath
    );
  }

  try {
    const result = await loginWithGoogle({
      authorizationCode: code,
      redirectUri: storedRequest.redirectUri,
      codeVerifier: storedRequest.codeVerifier ?? undefined,
    });

    clearGoogleAuthorizationState();

    return {
      ...result,
      successPath: storedRequest.successPath,
      fallbackPath,
    };
  } catch (error) {
    clearGoogleAuthorizationState();
    error.fallbackPath = error.fallbackPath ?? fallbackPath;
    throw error;
  }
};
