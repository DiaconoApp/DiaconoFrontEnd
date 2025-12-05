export const ROLES = {
  GOVERNO: "GOVERNO",
  LIDER_MINISTERIO: "LIDER_MINISTERIO",
  MEMBRO: "MEMBRO",
};

export const permissions = {
  [ROLES.GOVERNO]: ["eventos", "escalas", "membros", "ministerios"],
  [ROLES.LIDER_MINISTERIO]: ["eventos", "escalas", "membros", "ministerios"],
  [ROLES.MEMBRO]: ["eventos", "escalas"],
};
