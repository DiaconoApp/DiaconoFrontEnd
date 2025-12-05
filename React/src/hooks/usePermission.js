import { permissions } from "../routes/roles";
import { useAuth } from "../routes/AuthContext";

export function usePermission() {
  const { user } = useAuth();

  // Função que verifica se o cargo atual tem determinada permissão
  const can = (feature) => {
    return permissions[user.cargo]?.includes(feature);
  };

  return { can };
}