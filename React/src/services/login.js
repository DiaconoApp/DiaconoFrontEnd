import api from "../provider/api";
import { jwtDecode } from "jwt-decode";

export const login = async (email, senha) => {
  try {
    const response = await api.post("/api/v1/auth/login", { email, password: senha });

    const token = response.data.accessToken ?? response.data.acessToken ?? response.data.token;
    if (!token) throw new Error("Token não retornado pelo servidor");

    localStorage.setItem("token", token);

    let payload = null;
    try { payload = jwtDecode(token); } catch (e) { }

    return { token, payload, user: response.data.user ?? response.data ?? payload };
  } catch (err) {
    console.error("login error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    throw new Error(err.response?.data?.message ?? err.message);
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};