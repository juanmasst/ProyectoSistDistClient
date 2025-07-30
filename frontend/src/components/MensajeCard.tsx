import type { Mensaje } from "../types/api";
import { buildImageUrl } from "../utils/imageUtils";

interface MensajeCardProps {
  mensaje: Mensaje;
}

export default function MensajeCard({ mensaje }: MensajeCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const messageDate = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - messageDate.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "hace un momento";
    if (diffInMinutes < 60) return `hace ${diffInMinutes}m`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `hace ${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `hace ${diffInDays}d`;

    return formatDate(dateString);
  };

  const imageUrl = mensaje.urlImagen ? buildImageUrl(mensaje.urlImagen) : "";
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {mensaje.autor?.imagen ? (
            <img
              src={mensaje.autor.imagen}
              alt={mensaje.autor.nombre || "Usuario"}
              className="w-12 h-12 rounded-xl shadow-sm border-2 border-white dark:border-gray-700"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-sm border-2 border-white dark:border-gray-700">
              <span className="text-lg font-bold text-white">
                {mensaje.autor?.nombre?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-gray-900 dark:text-white text-lg">
                {mensaje.autor?.nombre || "Usuario anónimo"}
              </span>
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{getTimeAgo(mensaje.fechaCreacion)}</span>
              </div>
            </div>

            {/* Botón de opciones */}
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 opacity-60 hover:opacity-100">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>

          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed mb-4">
            {mensaje.texto}
          </div>

          {imageUrl && (
            <div className="mt-4">
              <img
                src={imageUrl}
                alt="Imagen del mensaje"
                className="max-w-full h-auto rounded-xl max-h-96 object-cover shadow-md border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-200"
                onError={(e) => {
                  console.error("Error cargando imagen:", imageUrl);
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          )}

          {/* Acciones del mensaje */}
          <div className="flex items-center space-x-6 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-sm font-medium">Me gusta</span>
            </button>

            <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="text-sm font-medium">Responder</span>
            </button>

            <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-200">
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
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              <span className="text-sm font-medium">Compartir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
