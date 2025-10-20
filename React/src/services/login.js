import api from "../provider/api";

export const login = async (email, senha) => {
  const response = await api.get(`/usuarios?email=${email}&senha=${senha}`);
  const usuarios = response.data;

  if (usuarios.length > 0) {
    const usuario = usuarios[0];
    const tokenSimulado = btoa(JSON.stringify({ id: usuario.id, nome: usuario.nome }));
    localStorage.setItem("token", tokenSimulado);
    return tokenSimulado;
  } else {
    throw new Error("Credenciais inválidas");
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};


// export const getPerfil = async () => {
//   const response = await api.get("/perfil");
//   return response.data;
// };

