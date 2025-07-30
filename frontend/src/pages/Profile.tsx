import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { authEndpoints } from "../services/api";
import type { Usuario, Tema, PaginatedResponse } from "../types/api";
import TemaCard from "../components/TemaCard";

export default function Profile() {
  const { user: auth0User, isAuthenticated } = useAuth();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [userTemas, setUserTemas] = useState<Tema[]>([]);
  const [temasPagination, setTemasPagination] = useState({
    page: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingTemas, setLoadingTemas] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const cargarTemasUsuario = async (page = 0) => {
      if (!isAuthenticated) return;

      setLoadingTemas(true);
      try {
        const response = await authEndpoints.myTemas(page, 5);
        const data: PaginatedResponse<Tema> = response.data;

        setUserTemas(data.content);
        setTemasPagination({
          page: data.number,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
        });
      } catch (err) {
        console.error("Error cargando temas del usuario:", err);
      } finally {
        setLoadingTemas(false);
      }
    };

    const cargarPerfil = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await authEndpoints.me();
        setUsuario(response.data);

        // Cargar temas del usuario
        await cargarTemasUsuario();
      } catch (err) {
        setError("Error al cargar el perfil");
        console.error("Error cargando perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, [isAuthenticated]);
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Acceso Requerido
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Debes iniciar sesión para ver tu perfil.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
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
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 animate-pulse">
          Cargando tu perfil...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error al cargar
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reintentar
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header del perfil */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-1 shadow-lg">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              {usuario?.imagen || auth0User?.picture ? (
                <img
                  src={usuario?.imagen || auth0User?.picture}
                  alt="Avatar"
                  className="w-32 h-32 rounded-2xl shadow-xl border-4 border-white dark:border-gray-800"
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-800">
                  <span className="text-4xl font-bold text-white">
                    {usuario?.nombre?.charAt(0).toUpperCase() ||
                      auth0User?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Badge de estado */}
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg border-2 border-white dark:border-gray-900">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-200 rounded-full animate-pulse"></div>
                  <span>En línea</span>
                </div>
              </div>
            </div>

            {/* Información principal */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {usuario?.nombre || auth0User?.name}
              </h1>

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mb-6">
                <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600 dark:text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                  <span className="text-lg">
                    {usuario?.email || auth0User?.email}
                  </span>
                </div>

                {usuario && (
                  <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a4 4 0 118 0v4m-8 0h8.1a3 3 0 013 3v5a3 3 0 01-3 3H8a3 3 0 01-3-3v-5a3 3 0 013-3z"
                      />
                    </svg>
                    <span>
                      Miembro desde{" "}
                      {new Date(usuario.fechaCreacion).toLocaleDateString(
                        "es-ES",
                        { year: "numeric", month: "long" }
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto md:mx-0">
                {" "}
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {temasPagination.totalElements}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Temas
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    47
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Mensajes
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    8
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    Likes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información detallada */}
      {usuario && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Detalles del perfil */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Información del Perfil
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ID de Usuario
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                  #{usuario.id}
                </span>
              </div>

              <div className="flex justify-between items-start py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Auth0 ID
                </span>
                <span className="text-xs text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg max-w-48 truncate">
                  {usuario.auth0Id}
                </span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Fecha de Registro
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(usuario.fechaCreacion).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Actividad reciente */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Actividad Reciente
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Creaste un nuevo tema
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-300">
                    hace 2 horas
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Respondiste en un tema
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-300">
                    hace 1 día
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    Te gustó un mensaje
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-300">
                    hace 3 días
                  </p>
                </div>
              </div>
            </div>{" "}
          </div>
        </div>
      )}

      {/* Sección de Mis Temas */}
      {usuario && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Mis Temas
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {temasPagination.totalElements} temas creados
                </p>
              </div>
            </div>
          </div>

          {loadingTemas ? (
            <div className="flex justify-center items-center py-8">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-purple-200 dark:border-purple-800 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
              </div>
            </div>
          ) : userTemas.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No has creado temas aún
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                ¡Comienza creando tu primer tema para iniciar conversaciones
                interesantes!
              </p>
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Crear Nuevo Tema
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {userTemas.map((tema) => (
                <TemaCard key={tema.id} tema={tema} />
              ))}

              {/* Paginación para temas del usuario */}
              {temasPagination.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    disabled={temasPagination.page === 0}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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

                  <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
                    Página {temasPagination.page + 1} de{" "}
                    {temasPagination.totalPages}
                  </span>

                  <button
                    disabled={
                      temasPagination.page >= temasPagination.totalPages - 1
                    }
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
          )}
        </div>
      )}

      {!usuario && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Perfil en Sincronización
          </h3>
          <p className="text-yellow-600 dark:text-yellow-400 mb-6">
            Tu perfil aún no está completamente sincronizado con el servidor.
            Esto puede tomar unos momentos.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Actualizar
          </button>
        </div>
      )}
    </div>
  );
}
