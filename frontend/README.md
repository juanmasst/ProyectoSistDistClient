# SISTEMAS DISTRIBUIDOS 2025 - UDA
## Alumno Juan Manuel Massotto Lasagno - Legajo: 113842 

# Frontend - Foro Chat

Este proyecto es un frontend moderno para un sistema de foro con chat, usando Vite + React + TypeScript + TailwindCSS + Auth0.

## 🚀 Tecnologías
- Vite
- React 19 + TypeScript
- TailwindCSS + Flowbite (componentes modernos)
- React Router DOM
- Auth0 (@auth0/auth0-react)
- Axios

## 📦 Estructura de Carpetas

```
src/
  assets/
  components/
    Navbar.tsx
    Card.tsx
    Button.tsx
    ImageUpload.tsx
  hooks/
    useAuthApi.ts
  pages/
    Home.tsx
    Profile.tsx
    TopicDetail.tsx
    Login.tsx
  services/
    axios.ts
  App.tsx
  main.tsx
  routes.tsx
  index.css
```

## ⚙️ Variables de Entorno
Crea un archivo `.env` en la raíz:
```
VITE_API_URL=http://localhost:8080/api
VITE_AUTH0_DOMAIN=dev-xxxxxx.us.auth0.com
VITE_AUTH0_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx
VITE_AUTH0_AUDIENCE=https://dev-xxxxxx.us.auth0.com/api/v2/
```

## 🛠️ Scripts
- `npm run dev` - Levanta el servidor de desarrollo
- `npm run build` - Compila para producción
- `npm run lint` - Linting

## 🧩 Proxy para Desarrollo
Si necesitas un proxy para `/api`, ajusta `vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```

## 🖼️ Subida de Imágenes
Usa el componente `ImageUpload` para subir imágenes al backend.

## 🔐 Autenticación
El login/logout y rutas protegidas usan Auth0. El token JWT se envía automáticamente a la API en rutas protegidas.

## ✨ UI
Componentes visuales modernos con TailwindUI y Flowbite.

---

¡Listo para consumir la API del backend Spring Boot!
