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

export const loginWithGoogle = async (idTokenOrResponse) => {
  const idToken =
    typeof idTokenOrResponse === 'string'
      ? idTokenOrResponse
      : idTokenOrResponse?.credential ?? idTokenOrResponse?.access_token ?? idTokenOrResponse?.code;

  if (!idToken) {
    throw new Error("ID Token do Google não fornecido");
  }

  try {
    const res = await api.post("/api/v1/auth/google", { idToken });
    const token = getTokenFromResponse(res.data);
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
    console.error("google login error", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
    });
    throw new Error(err.response?.data?.message || err.message || "Erro ao fazer login com Google");
  }
};