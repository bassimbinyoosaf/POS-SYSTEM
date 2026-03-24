export const isAuthenticated = () => {
  try {
    const auth = localStorage.getItem("auth");
    const time = localStorage.getItem("auth_time");

    if (auth !== "true" || !time) return false;

    const loginTime = Number(time);
    if (!loginTime) return false;

    const SESSION_DURATION = 8 * 60 * 60 * 1000;
    if (Date.now() - loginTime > SESSION_DURATION) {
      localStorage.removeItem("auth");
      localStorage.removeItem("auth_time");
      return false;
    }

    return true;
  } catch {
    return false;
  }
};
