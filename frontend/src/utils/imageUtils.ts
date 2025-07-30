/**
 * Construye una URL completa para una imagen
 * @param url - URL relativa o absoluta de la imagen
 * @returns URL completa de la imagen
 */
export const buildImageUrl = (url: string): string => {
  if (!url) return '';
  
  // Si ya es una URL completa, usarla tal como está
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Si es una ruta relativa, construir la URL completa
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081';
  return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
};

/**
 * Verifica si una URL es válida para una imagen
 * @param url - URL a verificar
 * @returns true si la URL es válida
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const imageUrl = buildImageUrl(url);
    return imageUrl.length > 0;
  } catch {
    return false;
  }
}; 