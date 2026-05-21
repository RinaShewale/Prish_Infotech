import store from "../../app/store";

export const requireAuth = () => {
  const state = store.getState();
  const { user, authChecked } = state.auth;

  if (!authChecked) return "loading";
  if (!user) return "redirect";
  return "ok";
};