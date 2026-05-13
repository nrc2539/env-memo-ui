export const API_URL = import.meta.env.VITE_API_URL || "";

export const DEFAULT_PERPAGE = 10;

export const DEFAULT_PAGE = 1;

export const passwordRegx =
  /^(?=.*[A-Za-z])(?=.*[\W_])[A-Za-z0-9!@#$%^&*()_+={}\\[\]:;"'<>,.?/\\|`~-]{10,}$/;
