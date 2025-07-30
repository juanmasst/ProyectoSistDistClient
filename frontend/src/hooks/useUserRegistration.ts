import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { publicEndpoints } from "../services/api";

// Función para invalidar el cache (para uso externo)
export const invalidateUserRegistrationCache = () => {
  // Simplemente forzar una nueva verificación
  window.location.reload();
};

export const useUserRegistration = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Si no está autenticado o aún está cargando, limpiar estado
    if (!isAuthenticated || isLoading) {
      setUserExists(null);
      setIsChecking(false);
      return;
    }

    // Si no hay userId, no hacer nada
    if (!user?.sub) {
      setUserExists(null);
      setIsChecking(false);
      return;
    }

    // Solo verificar si no tenemos un resultado
    if (userExists === null && !isChecking) {
      setIsChecking(true);

      publicEndpoints
        .checkUserExists(user.sub)
        .then((response) => {
          const exists = response.data?.exists ?? false;
          setUserExists(exists);
        })
        .catch((error) => {
          console.error("Error checking user existence:", error);
          setUserExists(false);
        })
        .finally(() => {
          setIsChecking(false);
        });
    }
  }, [isAuthenticated, isLoading, user?.sub, userExists, isChecking]);

  // Estados simplificados
  const isCheckingUser = isAuthenticated && !isLoading && isChecking;
  const needsRegistration =
    isAuthenticated && !isLoading && userExists === false;
  const isFullyRegistered =
    isAuthenticated && !isLoading && userExists === true;

  return {
    userExists,
    isCheckingUser,
    needsRegistration,
    isFullyRegistered,
  };
};
