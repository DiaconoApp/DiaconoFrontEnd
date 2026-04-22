export const ROLES = {
  GOVERNO: "GOVERNO",
  LIDER_MINISTERIO: "LIDER_MINISTERIO",
  MEMBRO: "MEMBRO",
};

export const permissions = {
  [ROLES.GOVERNO]: ["calendario", "eventos", "criar_evento", "editar_evento", "membros", "ministerios", "dashboards", "escalas"],
  [ROLES.LIDER_MINISTERIO]: ["calendario", "eventos", "criar_evento", "editar_evento", "membros", "ministerios", "dashboards", "escalas"],
  [ROLES.MEMBRO]: ["calendario", "eventos", "escalas"],
};
