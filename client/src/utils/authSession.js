let unauthorizedHandler = null;

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

export const triggerUnauthorized = () => {
  unauthorizedHandler?.();
};

export const isAuthRoute = (pathname) =>
  ['/login', '/register'].some((path) => pathname.startsWith(path));
