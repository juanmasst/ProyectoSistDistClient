import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUserRegistration } from "../hooks/useUserRegistration";
import { temaEndpoints, mensajeEndpoints } from "../services/api";
import MensajeCard from "../components/MensajeCard";
import CrearMensajeForm from "../components/CrearMensajeForm";
import RegistrationRequiredBanner from "../components/RegistrationRequiredBanner";
import type { Tema, Mensaje, PaginatedResponse } from "../types/api";

export default function TopicDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { needsRegistration } = useUserRegistration();
  const navigate = useNavigate();
  const [tema, setTema] = useState<Tema | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0,
  });

  const temaId = parseInt(id || "0");

  const cargarMensajes = async (page = 0) => {
    if (!temaId) return;

    try {
      const response = await mensajeEndpoints.getByTema(temaId, page, 20);
      const data: PaginatedResponse<Mensaje> = response.data;

      setMensajes(data.content);
      setPagination({
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (err) {
      setError("Error al cargar los mensajes");
      console.error("Error cargando mensajes:", err);
    }
  };

  useEffect(() => {
    if (!temaId) return;

    // Redirigir si el usuario necesita completar su registro
    if (isAuthenticated && needsRegistration) {
      navigate("/register");
      return;
    }

    const cargarDatos = async () => {
      setLoading(true);
      setError(null);

      try {
        // Cargar tema
        const temaResponse = await temaEndpoints.getById(temaId);
        setTema(temaResponse.data);

        // Cargar mensajes
        const mensajesResponse = await mensajeEndpoints.getByTema(
          temaId,
          0,
          20
        );
        const data: PaginatedResponse<Mensaje> = mensajesResponse.data;

        setMensajes(data.content);
        setPagination({
          page: data.number,
          size: data.size,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
        });
      } catch (err) {
        setError("Error al cargar el tema");
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [temaId, isAuthenticated, needsRegistration, navigate]);

  const handleMensajeCreado = () => {
    cargarMensajes(0); // Recargar desde la primera página
    if (tema) {
      // Actualizar el contador de mensajes del tema
      setTema((prev) =>
        prev ? { ...prev, cantidadMensajes: prev.cantidadMensajes + 1 } : null
      );
    }
  };

  const handlePageChange = (newPage: number) => {
    cargarMensajes(newPage);
  };

  if (!temaId) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">ID de tema inválido</p>
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
          Cargando tema...
        </p>
      </div>
    );
  }
  if (error || !tema) {
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
            {error || "Tema no encontrado"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No pudimos cargar el tema solicitado. Puede que no exista o haya
            ocurrido un error.
          </p>
          <Link
            to="/"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {" "}
      {/* Header del tema */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-1 shadow-lg">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 font-medium"
            >
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Volver a temas</span>
            </Link>

            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <svg
                className="w-4 h-4"
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
              <span>{pagination.totalElements} mensajes</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {tema.titulo}
          </h1>

          {tema.descripcion && (
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {tema.descripcion}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {tema.autor?.imagen ? (
                <img
                  src={tema.autor.imagen}
                  alt={tema.autor.nombre || "Usuario"}
                  className="w-12 h-12 rounded-xl shadow-md border-2 border-white dark:border-gray-700"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-md border-2 border-white dark:border-gray-700">
                  <span className="text-lg font-bold text-white">
                    {tema.autor?.nombre?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {tema.autor?.nombre || "Usuario anónimo"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Creado el{" "}
                  {new Date(tema.fechaCreacion).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {tema.cantidadMensajes}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  Respuestas
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Formulario para crear mensaje */}
      {isAuthenticated && !needsRegistration && (
        <CrearMensajeForm
          temaId={temaId}
          onMensajeCreado={handleMensajeCreado}
        />
      )}
      {/* Mensaje para usuarios no registrados */}
      {isAuthenticated && needsRegistration && (
        <RegistrationRequiredBanner message="Necesitas completar tu perfil para poder responder a los temas." />
      )}{" "}
      {/* Lista de mensajes */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
            <svg
              className="w-7 h-7 text-blue-500"
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
            <span>Conversación</span>
          </h2>

          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2V6a2 2 0 012-2h4a2 2 0 012 2v2z"
              />
            </svg>
            <span>{pagination.totalElements} mensajes</span>
          </div>
        </div>

        {mensajes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Sin mensajes aún
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              {isAuthenticated && !needsRegistration
                ? "¡Sé el primero en iniciar la conversación! Comparte tu opinión o pregunta sobre este tema."
                : "No hay mensajes disponibles en este tema."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {mensajes.map((mensaje) => (
              <MensajeCard key={mensaje.id} mensaje={mensaje} />
            ))}
          </div>
        )}
      </div>{" "}
      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 mt-8">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 0}
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

          <div className="flex items-center space-x-2">
            <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              Página {pagination.page + 1} de {pagination.totalPages}
            </span>
          </div>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages - 1}
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
  );
}
