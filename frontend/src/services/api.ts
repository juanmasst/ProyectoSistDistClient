import axios from "axios";
import type {
  HealthResponse,
  Usuario,
  Tema,
  Mensaje,
  PaginatedResponse,
  CrearTemaRequest,
  CrearMensajeRequest,
  CrearUsuarioRequest,
  FileUploadResponse,
} from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

// Configuración base de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Cache para el token para evitar llamadas repetidas a localStorage
let tokenCache: string | null = null;
let tokenCacheTime = 0;
const TOKEN_CACHE_DURATION = 5000; // 5 segundos

const getCachedToken = (): string | null => {
  const now = Date.now();
  if (tokenCache && now - tokenCacheTime < TOKEN_CACHE_DURATION) {
    return tokenCache;
  }

  tokenCache = localStorage.getItem("auth0_token");
  tokenCacheTime = now;
  return tokenCache;
};

// Función para limpiar el cache del token
export const clearTokenCache = () => {
  tokenCache = null;
  tokenCacheTime = 0;
};

// Interceptor para agregar el token de Auth0 a las requests
api.interceptors.request.use(
  async (config) => {
    // Solo agregar token si no es un endpoint público
    if (
      !config.url?.includes("/public/") &&
      !config.url?.includes("/auth/public/")
    ) {
      try {
        // Obtener el token de Auth0 desde el cache/localStorage
        const token = getCachedToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error obteniendo token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem("auth0_token");
      tokenCache = null; // Limpiar cache
      // Solo redirigir si no estamos ya en login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Endpoints públicos
export const publicEndpoints = {
  health: () => api.get<HealthResponse>("/api/auth/public/health"),
  publicTemas: (page = 0, size = 10) =>
    api.get<PaginatedResponse<Tema>>(
      `/api/public/temas?page=${page}&size=${size}`
    ),
  checkUserExists: (auth0Id: string) =>
    api.get<{ exists: boolean }>(`/api/auth/public/user-exists/${auth0Id}`),
};

// Endpoints autenticados
export const authEndpoints = {
  me: () => api.get<Usuario>("/api/auth/me"),
  myTemas: (page = 0, size = 10) =>
    api.get<PaginatedResponse<Tema>>(
      `/api/auth/me/temas?page=${page}&size=${size}`
    ),
};

// Endpoints de usuarios
export const usuarioEndpoints = {
  create: (data: CrearUsuarioRequest) =>
    api.post<Usuario>("/api/usuarios", data),
  getById: (id: number) => api.get<Usuario>(`/api/usuarios/${id}`),
};

export const temaEndpoints = {
  getAll: (page = 0, size = 10) =>
    api.get<PaginatedResponse<Tema>>(`/api/temas?page=${page}&size=${size}`),
  getById: (id: number) => api.get<Tema>(`/api/temas/${id}`),
  create: (data: CrearTemaRequest) => api.post<Tema>("/api/temas", data),
};

export const mensajeEndpoints = {
  getByTema: (temaId: number, page = 0, size = 20) =>
    api.get<PaginatedResponse<Mensaje>>(
      `/api/mensajes/tema/${temaId}?page=${page}&size=${size}`
    ),
  create: (data: CrearMensajeRequest) =>
    api.post<Mensaje>("/api/mensajes", data),
};

export const fileEndpoints = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    // Usar axios directamente sin el interceptor para este endpoint público
    return axios.post<FileUploadResponse>(
      `${API_BASE_URL}/api/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
  getImage: (filename: string) => `${API_BASE_URL}/api/upload/${filename}`,
};

export default api;
