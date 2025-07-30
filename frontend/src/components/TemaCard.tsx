import { Link } from "react-router-dom";
import type { Tema } from "../types/api";

interface TemaCardProps {
  tema: Tema;
}

export default function TemaCard({ tema }: TemaCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 group">
      <div className="p-6">
        {/* Header del tema */}
        <div className="mb-4">
          <Link
            to={`/topic/${tema.id}`}
            className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2"
          >
            {tema.titulo}
          </Link>

          {tema.descripcion && (
            <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
              {tema.descripcion}
            </p>
          )}
        </div>

        {/* Información del autor */}
        <div className="flex items-center mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center space-x-3 flex-1">
            {tema.autor?.imagen ? (
              <img
                src={tema.autor.imagen}
                alt={tema.autor.nombre || "Usuario"}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-600 shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                {(tema.autor?.nombre || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">
                {tema.autor?.nombre || "Usuario anónimo"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(tema.fechaCreacion)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer con estadísticas y botón */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
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
              <span className="text-sm font-medium">
                {tema.cantidadMensajes || 0}
              </span>
              <span className="text-xs">mensajes</span>
            </div>
          </div>

          <Link
            to={`/topic/${tema.id}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <span>Ver tema</span>
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
          </Link>
        </div>
      </div>
    </div>
  );
}
