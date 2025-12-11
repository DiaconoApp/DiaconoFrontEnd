export const ROLES = {
  GOVERNO: "GOVERNO",
  LIDER_MINISTERIO: "LIDER_MINISTERIO",
  MEMBRO: "MEMBRO",
};

export const permissions = {
  [ROLES.GOVERNO]: ["eventos", "membros", "ministerios", "dashboards"],
  [ROLES.LIDER_MINISTERIO]: ["eventos", "membros", "ministerios", "dashboards"],
  [ROLES.MEMBRO]: ["eventos"],
};
