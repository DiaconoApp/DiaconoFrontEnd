import api from "../provider/api";
import { jwtDecode } from "jwt-decode";

const getTokenFromResponse = (data) => data.acessToken ?? data.accessToken;

const saveUserData = (token, payload) => {
  localStorage.setItem("nome", payload.nome);
  localStorage.setItem("cargo", payload.scope);
  localStorage.setItem("fk_igreja", payload.fk_igreja);
  localStorage.setItem("idUsuario", payload.sub);
  localStorage.setItem("token", token);
};

export const login = async (email, senha) => {
  try {
    const response = await api.post("/api/v1/auth/login", { email, senha });

    const token = getTokenFromResponse(response.data);
    if (!token) throw new Error("Token não retornado pelo servidor");

    let payload = null;
    try { payload = jwtDecode(token); } catch { throw new Error("Token inválido"); }

    console.log("login payload:", payload);

    const user = {
      cargo: payload.scope,
    };

    saveUserData(token, payload);
    return { token, payload, user };

  } catch (err) {
    console.error("login error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const logout = () => {
  localStorage.clear();
  // Redirect to landing page after logout (avoid staying on protected routes)
  window.location.href = '/home';
};

const getGooglePayload = (googleAuthData) => {
  const authorizationCode = googleAuthData?.authorizationCode;
  const redirectUri = googleAuthData?.redirectUri;
  const codeVerifier = googleAuthData?.codeVerifier;

  if (!authorizationCode) {
    throw new Error("Authorization code do Google não fornecido");
  }

  if (!redirectUri) {
    throw new Error("Redirect URI do Google não configurado");
  }

  return {
    authorizationCode,
    redirectUri,
    ...(codeVerifier ? { codeVerifier } : {}),
  };
};

const getGoogleLoginErrorMessage = (err) => {
  const status = err.response?.status;
  const backendMessage = err.response?.data?.message;

  switch (status) {
    case 401:
      return backendMessage || "Não foi possível validar o login com Google.";
    case 404:
      return backendMessage || "O email da conta Google não corresponde a um membro interno.";
    case 502:
      return backendMessage || "Falha de comunicação com o Google. Tente novamente em instantes.";
    default:
      return backendMessage || err.message || "Erro ao fazer login com Google";
  }
};

export const loginWithGoogle = async (googleAuthData) => {
  const requestPayload = getGooglePayload(googleAuthData);

  try {
    const res = await api.post("/api/v1/auth/google", requestPayload);
    const token = getTokenFromResponse(res.data);
    if (!token) throw new Error("Token não retornado pelo servidor");

    let jwtPayload = null;
    try { jwtPayload = jwtDecode(token); } catch { throw new Error("Token inválido"); }

    console.log("login payload:", jwtPayload);

    const user = {
      cargo: jwtPayload.scope,
    };

    saveUserData(token, jwtPayload);
    return { token, payload: jwtPayload, user };
  } catch (err) {
    console.error("google login error", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
    });
    const error = new Error(getGoogleLoginErrorMessage(err));
    error.status = err.response?.status;
    throw error;
  }
};
