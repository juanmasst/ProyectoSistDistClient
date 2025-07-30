import { useState, useRef } from "react";
import { mensajeEndpoints, fileEndpoints } from "../services/api";
import { buildImageUrl } from "../utils/imageUtils";
import type { CrearMensajeRequest } from "../types/api";

interface CrearMensajeFormProps {
  temaId: number;
  onMensajeCreado: () => void;
}

export default function CrearMensajeForm({
  temaId,
  onMensajeCreado,
}: CrearMensajeFormProps) {
  const [formData, setFormData] = useState<CrearMensajeRequest>({
    texto: "",
    urlImagen: "",
    temaId,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.texto.trim()) {
      setError("El mensaje no puede estar vacío");
      return;
    }

    if (formData.texto.length > 2000) {
      setError("El mensaje no puede exceder 2000 caracteres");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await mensajeEndpoints.create(formData);
      setFormData({ texto: "", urlImagen: "", temaId });
      onMensajeCreado();
    } catch (err) {
      setError("Error al crear el mensaje. Inténtalo de nuevo.");
      console.error("Error creando mensaje:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      texto: value,
    }));

    if (error) {
      setError(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Archivo seleccionado:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten archivos de imagen");
      return;
    }

    // Validar tamaño (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("La imagen no puede exceder 10MB");
      return;
    }

    setUploadingImage(true);
    setError(null);

    try {
      console.log("Iniciando subida de imagen...");
      const response = await fileEndpoints.upload(file);
      console.log("Respuesta de subida:", response.data);

      setFormData((prev) => ({
        ...prev,
        urlImagen: response.data.url,
      }));

      console.log("URL de imagen guardada:", response.data.url);
    } catch (err) {
      console.error("Error subiendo imagen:", err);
      if (err && typeof err === "object" && "response" in err) {
        const apiError = err as {
          response?: { data?: { error?: string }; status?: number };
        };
        console.error("Error de API:", apiError.response?.data);
        setError(
          `Error al subir la imagen: ${
            apiError.response?.data?.error || "Error desconocido"
          }`
        );
      } else {
        setError("Error al subir la imagen. Inténtalo de nuevo.");
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      urlImagen: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-1 shadow-lg">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Únete a la conversación
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tu mensaje
            </label>
            <textarea
              name="texto"
              value={formData.texto}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200 resize-none"
              placeholder="Comparte tu opinión, pregunta o respuesta..."
              maxLength={2000}
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formData.texto.length}/2000 caracteres
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <svg
                  className="w-3 h-3"
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
                <span>Markdown compatible</span>
              </div>
            </div>
          </div>

          {/* Imagen subida */}
          {formData.urlImagen && (
            <div className="relative rounded-xl overflow-hidden shadow-md">
              <img
                src={buildImageUrl(formData.urlImagen)}
                alt="Imagen a subir"
                className="max-w-full h-auto max-h-48 object-cover w-full"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                <p className="text-white text-sm font-medium">Imagen adjunta</p>
              </div>
            </div>
          )}

          {/* Barra de herramientas */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="flex items-center space-x-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage || isLoading}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage || isLoading}
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {uploadingImage ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Subiendo...</span>
                  </>
                ) : (
                  <>
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Agregar imagen</span>
                  </>
                )}
              </button>

              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>

              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14L17 4M9 9v6M15 9v6"
                  />
                </svg>
                <span>JPG, PNG hasta 10MB</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <svg
                className="w-5 h-5 text-red-500"
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
              <span className="text-red-700 dark:text-red-400 text-sm font-medium">
                {error}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || uploadingImage || !formData.texto.trim()}
            className="w-full inline-flex items-center justify-center space-x-2 py-3 px-6 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Enviando mensaje...</span>
              </>
            ) : (
              <>
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
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                <span>Enviar Mensaje</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
