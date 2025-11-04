import api from "../provider/api";
import { jwtDecode } from "jwt-decode";

export const login = async (email, senha) => {
  try {
    const response = await api.post("/api/v1/auth/login", { email, senha });

    const token = response.data.acessToken;
    if (!token) throw new Error("Token não retornado pelo servidor");

    
    let payload = null;
    try { payload = jwtDecode(token); } catch (e) { }
    
    console.log("login payload:", payload);

    localStorage.setItem("token", token);
    localStorage.setItem("nome", payload.nome);
    localStorage.setItem("cargo", payload.scope);

    return { token, payload, user: response.data.user ?? response.data ?? payload };

  } catch (err) {
    console.error("login error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    throw new Error(err.message);
  }
};

export const logout = () => {
  localStorage.clear();
  window.location.reload();
};