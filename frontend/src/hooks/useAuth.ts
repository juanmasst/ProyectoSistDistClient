import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef, useCallback } from "react";
import { clearTokenCache } from "../services/api";

export const useAuth = () => {
  const {
    isAuthenticated,
    getAccessTokenSilently,
    user,
    loginWithRedirect,
    logout,
    isLoading: auth0Loading,
  } = useAuth0();

  const tokenSavedRef = useRef(false);
  const isAuthenticatedRef = useRef(isAuthenticated);

  // Actualizar la referencia cuando cambia isAuthenticated
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  // Guardar el token en localStorage cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated && !tokenSavedRef.current) {
      const saveToken = async () => {
        try {
          const token = await getAccessTokenSilently();
          localStorage.setItem("auth0_token", token);
          tokenSavedRef.current = true;
          // Limpiar cache para forzar una nueva lectura
          clearTokenCache();
        } catch (error) {
          console.error("Error obteniendo token:", error);
          // Si hay error obteniendo el token, limpiar el localStorage
          localStorage.removeItem("auth0_token");
          clearTokenCache();
        }
      };
      saveToken();
    } else if (!isAuthenticated && tokenSavedRef.current) {
      // Limpiar token cuando no está autenticado
      localStorage.removeItem("auth0_token");
      clearTokenCache();
      tokenSavedRef.current = false;
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleLogin = useCallback(() => {
    loginWithRedirect();
  }, [loginWithRedirect]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("auth0_token");
    clearTokenCache();
    tokenSavedRef.current = false;
    logout();
  }, [logout]);

  const getToken = useCallback(async () => {
    if (isAuthenticatedRef.current) {
      try {
        return await getAccessTokenSilently();
      } catch (error) {
        console.error("Error obteniendo token:", error);
        return null;
      }
    }
    return null;
  }, [getAccessTokenSilently]);

  return {
    isAuthenticated,
    user,
    login: handleLogin,
    logout: handleLogout,
    getToken,
    isLoading: auth0Loading,
  };
};
