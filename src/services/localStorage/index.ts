const STORAGE_KEYS = {
  JWT_TOKEN: "JWT_TOKEN",
  PROF_ID: "PROF_ID"
};

export const getJWTToken = () => {
  return localStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
};

export const setJWTToken = (token: string) => {
  localStorage.setItem(STORAGE_KEYS.JWT_TOKEN, token);
};

export const clearJWTToken = () => {
  localStorage.removeItem(STORAGE_KEYS.JWT_TOKEN);
};

export const setProfId = (profId: string) => {
  localStorage.setItem(STORAGE_KEYS.PROF_ID, profId);
};

export const getProfId = () => {
  return localStorage.getItem(STORAGE_KEYS.PROF_ID);
};

export const clearProfId = () => {
  localStorage.removeItem(STORAGE_KEYS.PROF_ID);
};
