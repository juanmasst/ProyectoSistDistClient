import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUserRegistration } from "../hooks/useUserRegistration";
import CrearUsuarioForm from "../components/CrearUsuarioForm";

export default function Register() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { isCheckingUser, isFullyRegistered } = useUserRegistration();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si está completamente registrado, redirigir al home
    if (isFullyRegistered) {
      navigate("/");
    }

    // Si está autenticado pero no tiene datos de Auth0, mostrar error
    if (
      isAuthenticated &&
      !isLoading &&
      !isCheckingUser &&
      (!user?.email || !user?.name)
    ) {
      setError("Necesitamos información adicional para completar tu registro");
    }
  }, [
    isAuthenticated,
    isLoading,
    isCheckingUser,
    isFullyRegistered,
    user,
    navigate,
  ]);
  const handleSuccess = () => {
    navigate("/");
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (isLoading || isCheckingUser) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          {isLoading ? "Cargando..." : "Verificando usuario..."}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Acceso Requerido
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Necesitas iniciar sesión primero para completar tu registro.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh] p-4">
      <div className="max-w-md w-full">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        <CrearUsuarioForm onSuccess={handleSuccess} onError={handleError} />

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
          >
            Cancelar y volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
