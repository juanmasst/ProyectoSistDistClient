// Tipos para la API
export interface HealthResponse {
  status: string;
  message: string;
}

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  imagen?: string;
  auth0Id: string;
  fechaCreacion: string;
}

export interface Tema {
  id: number;
  titulo: string;
  descripcion?: string;
  autor?: Usuario;
  fechaCreacion: string;
  cantidadMensajes: number;
}

export interface Mensaje {
  id: number;
  texto: string;
  urlImagen?: string;
  autor: Usuario;
  tema: Tema;
  fechaCreacion: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface CrearTemaRequest {
  titulo: string;
  descripcion?: string;
}

export interface CrearMensajeRequest {
  texto: string;
  urlImagen?: string;
  temaId: number;
}

export interface FileUploadResponse {
  url: string;
  mensaje: string;
}

export interface CrearUsuarioRequest {
  email: string;
  nombre: string;
  fotoPerfil?: string;
  auth0Id: string;
} 