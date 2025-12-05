export const ROLES = {
  GOVERNO: "GOVERNO",
  LIDER_MIINISTERIO: "LIDER_MINISTERIO",
  MEMBRO: "MEMBRO",
};

export const permissions = {
  [ROLES.GOVERNO]: ["eventos", "escalas", "membros", "ministerios"],
  [ROLES.LIDER_MIINISTERIO]: ["eventos", "escalas", "membros", "ministerios"],
  [ROLES.MEMBRO]: ["eventos", "escalas"],
};
