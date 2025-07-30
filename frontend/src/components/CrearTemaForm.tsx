import { useState } from "react";
import { temaEndpoints } from "../services/api";
import type { CrearTemaRequest } from "../types/api";

interface CrearTemaFormProps {
  onTemaCreado: () => void;
}

export default function CrearTemaForm({ onTemaCreado }: CrearTemaFormProps) {
  const [formData, setFormData] = useState<CrearTemaRequest>({
    titulo: "",
    descripcion: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titulo.trim()) {
      setError("El título es obligatorio");
      return;
    }

    if (formData.titulo.length < 3) {
      setError("El título debe tener al menos 3 caracteres");
      return;
    }

    if (formData.titulo.length > 100) {
      setError("El título no puede exceder 100 caracteres");
      return;
    }

    if (formData.descripcion && formData.descripcion.length > 1000) {
      setError("La descripción no puede exceder 1000 caracteres");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await temaEndpoints.create(formData);
      setFormData({ titulo: "", descripcion: "" });
      onTemaCreado();
    } catch (err) {
      setError("Error al crear el tema. Inténtalo de nuevo.");
      console.error("Error creando tema:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      setError(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Crear Nuevo Tema
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="titulo"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Título *
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Título del tema (3-100 caracteres)"
            maxLength={100}
            disabled={isLoading}
          />
        </div>
        <div>
          <label
            htmlFor="descripcion"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Descripción (opcional)
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Descripción del tema (máximo 1000 caracteres)"
            maxLength={1000}
            disabled={isLoading}
          />
        </div>
        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
        )}{" "}
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none dark:focus:ring-offset-gray-800"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creando tema...
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
                Crear Tema
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
