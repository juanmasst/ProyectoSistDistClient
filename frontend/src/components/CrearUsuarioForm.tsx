import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { invalidateUserRegistrationCache } from "../hooks/useUserRegistration";
import { usuarioEndpoints } from "../services/api";
import type { CrearUsuarioRequest } from "../types/api";

interface CrearUsuarioFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function CrearUsuarioForm({
  onSuccess,
  onError,
}: CrearUsuarioFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CrearUsuarioRequest>({
    email: user?.email || "",
    nombre: user?.name || "",
    fotoPerfil: user?.picture || "",
    auth0Id: user?.sub || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await usuarioEndpoints.create(formData);

      // Invalidar el cache para que el hook detecte que el usuario ahora existe
      invalidateUserRegistrationCache();

      onSuccess?.();
    } catch (error: unknown) {
      let errorMessage = "Error al crear el usuario";

      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
          response?: { status?: number; data?: { message?: string } };
        };
        if (apiError.response?.status === 409) {
          errorMessage = "El usuario ya existe en el sistema";
        } else if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      }
      onError?.(errorMessage);
    } finally {
      console.log("🏁 DEBUG CrearUsuarioForm handleSubmit - Finished:", {
        isLoading: false,
        timestamp: new Date().toISOString(),
      });
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Completar Registro
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="usuario@ejemplo.com"
          />
        </div>

        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Nombre Completo
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Juan Pérez"
          />
        </div>

        <div>
          <label
            htmlFor="fotoPerfil"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            URL de Foto de Perfil (opcional)
          </label>
          <input
            type="url"
            id="fotoPerfil"
            name="fotoPerfil"
            value={formData.fotoPerfil || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="https://ejemplo.com/foto.jpg"
          />
        </div>

        <div>
          <label
            htmlFor="auth0Id"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Auth0 ID
          </label>
          <input
            type="text"
            id="auth0Id"
            name="auth0Id"
            value={formData.auth0Id}
            onChange={handleInputChange}
            required
            readOnly
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-600 dark:text-white cursor-not-allowed"
            placeholder="auth0|1234567890"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Este campo se llena automáticamente desde Auth0
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creando usuario..." : "Completar Registro"}
        </button>
      </form>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Nota:</strong> Esta información se utilizará para crear tu
          perfil en el sistema del foro. Los datos de Auth0 se sincronizarán
          automáticamente.
        </p>
      </div>
    </div>
  );
}
