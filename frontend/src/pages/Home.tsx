import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUserRegistration } from "../hooks/useUserRegistration";
import { publicEndpoints, temaEndpoints } from "../services/api";
import TemaCard from "../components/TemaCard";
import CrearTemaForm from "../components/CrearTemaForm";
import RegistrationBanner from "../components/RegistrationBanner";
import ErrorBoundary from "../components/ErrorBoundary";
import type { Tema, PaginatedResponse } from "../types/api";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isCheckingUser, needsRegistration, isFullyRegistered } =
    useUserRegistration();
  const navigate = useNavigate();
  const location = useLocation();

  const [temas, setTemas] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(false); // Cambiado a false inicialmente
  const [error, setError] = useState<string | null>(null);
  const [showCrearTema, setShowCrearTema] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });

  const cargarTemas = async (page = 0) => {
    try {
      setError(null);
      const endpoint = isAuthenticated
        ? temaEndpoints.getAll
        : publicEndpoints.publicTemas;
      const response = await endpoint(page, 10);
      const data: PaginatedResponse<Tema> = response.data;

      setTemas(data.content);
      setPagination({
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (err) {
      setError("Error al cargar los temas");
      console.error("Error cargando temas:", err);
    }
  };

  // Redirigir a registro si el usuario necesita completar su registro
  useEffect(() => {
    if (needsRegistration && location.pathname !== "/register") {
      navigate("/register");
    }
  }, [needsRegistration, location.pathname, navigate]);

  // Cargar temas cuando sea apropiado
  useEffect(() => {
    // Solo cargar si no está en proceso de verificación o si necesita registro
    if (!isLoading && !isCheckingUser && !needsRegistration) {
      const cargarDatos = async () => {
        setLoading(true);
        try {
          setError(null);
          const endpoint = isAuthenticated
            ? temaEndpoints.getAll
            : publicEndpoints.publicTemas;
          const response = await endpoint(0, 10);
          const data: PaginatedResponse<Tema> = response.data;

          setTemas(data.content);
          setPagination({
            page: data.number,
            size: data.size,
            totalPages: data.totalPages,
            totalElements: data.totalElements,
          });
        } catch (err) {
          setError("Error al cargar los temas");
          console.error("Error cargando temas:", err);
        } finally {
          setLoading(false);
        }
      };
      cargarDatos();
    }
  }, [isLoading, isCheckingUser, needsRegistration, isAuthenticated]);

  const handleTemaCreado = () => {
    setShowCrearTema(false);
    cargarTemas(0);
  };

  const handlePageChange = (newPage: number) => {
    cargarTemas(newPage);
  };

  // Estados de carga
  if (isLoading || isCheckingUser) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          {isLoading ? "Inicializando..." : "Verificando usuario..."}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          Cargando temas...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner de registro pendiente */}
      {isAuthenticated && needsRegistration && <RegistrationBanner />}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isAuthenticated ? "Temas del Foro" : "Temas Públicos"}
        </h1>
        {/* Solo usuarios completamente registrados pueden crear temas */}
        {isFullyRegistered && (
          <button
            onClick={() => setShowCrearTema(!showCrearTema)}
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            {showCrearTema ? (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancelar
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Nuevo Tema
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Solo usuarios completamente registrados pueden crear temas */}
      {showCrearTema && isFullyRegistered && (
        <CrearTemaForm onTemaCreado={handleTemaCreado} />
      )}

      {temas.length === 0 && !loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            {isAuthenticated
              ? "No hay temas aún. ¡Crea el primero!"
              : "No hay temas públicos disponibles."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {temas.map((tema) => (
            <ErrorBoundary key={tema.id}>
              <TemaCard tema={tema} />
            </ErrorBoundary>
          ))}
        </div>
      )}

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-3 mt-8">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 0}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:bg-gray-700 transition-all duration-200"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Anterior
          </button>

          <div className="flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Página {pagination.page + 1} de {pagination.totalPages}
            </span>
          </div>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages - 1}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:bg-gray-700 transition-all duration-200"
          >
            Siguiente
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
