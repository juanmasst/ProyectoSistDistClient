# Registro de Usuarios con Auth0

## Descripción

Este sistema implementa un flujo de registro de usuarios que es compatible con Auth0 y el backend Spring Boot. El proceso permite a los usuarios autenticarse con Auth0 y luego completar su perfil en el sistema del foro.

## Flujo de Registro

### 1. Autenticación con Auth0
- El usuario hace clic en "Iniciar sesión con Auth0"
- Se redirige a la página de login de Auth0
- Después de autenticarse exitosamente, regresa a la aplicación

### 2. Verificación de Usuario
- El sistema verifica automáticamente si el usuario ya existe en la base de datos
- Si no existe, se redirige automáticamente a la página de registro
- Si ya existe, se redirige al home

### 3. Completar Registro
- El usuario completa un formulario con:
  - Email (pre-llenado desde Auth0)
  - Nombre completo (pre-llenado desde Auth0)
  - URL de foto de perfil (opcional, pre-llenado desde Auth0)
  - Auth0 ID (automático, no editable)

### 4. Creación en Backend
- Se envía una petición POST a `/api/usuarios` con los datos del usuario
- El backend valida y crea el usuario en la base de datos
- Se redirige al home una vez completado

## Endpoints del Backend

### POST /api/usuarios
Crea un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "nombre": "Juan Pérez",
  "fotoPerfil": "https://ejemplo.com/foto.jpg",
  "auth0Id": "auth0|1234567890"
}
```

**Response:**
- `201 Created`: Usuario creado exitosamente
- `409 Conflict`: Usuario ya existe (email o auth0Id duplicado)
- `400 Bad Request`: Datos inválidos

## Componentes Frontend

### 1. `CrearUsuarioForm`
- Formulario para completar el registro
- Pre-llena datos desde Auth0
- Maneja errores y estados de carga

### 2. `Register`
- Página de registro
- Verifica autenticación
- Muestra el formulario de registro

### 3. `RegistrationBanner`
- Banner que se muestra cuando el usuario necesita completar su registro
- Aparece en la página home y navbar

### 4. `useUserRegistration`
- Hook personalizado para verificar si el usuario existe
- Maneja la lógica de redirección automática

## Integración con Auth0

### Datos de Auth0 utilizados:
- `user.email`: Email del usuario
- `user.name`: Nombre completo
- `user.picture`: URL de la foto de perfil
- `user.sub`: Auth0 ID único

### Token de Autenticación:
- Se almacena en localStorage como `auth0_token`
- Se incluye automáticamente en las peticiones al backend
- Se maneja la expiración y renovación automática

## Estados de Usuario

### 1. No Autenticado
- Puede ver temas públicos
- Debe hacer login para participar

### 2. Autenticado pero No Registrado
- Se muestra banner de registro
- Redirección automática a `/register`
- No puede crear temas o mensajes

### 3. Autenticado y Registrado
- Acceso completo al sistema
- Puede crear temas y mensajes
- Acceso a perfil personal

## Manejo de Errores

### Errores Comunes:
- **409 Conflict**: Usuario ya existe
- **401 Unauthorized**: Token expirado o inválido
- **400 Bad Request**: Datos del formulario inválidos

### Recuperación:
- Tokens expirados redirigen automáticamente al login
- Errores de validación se muestran en el formulario
- Errores de red se manejan con mensajes informativos

## Configuración

### Variables de Entorno:
```env
VITE_API_URL=http://localhost:8081
```

### Auth0 Configuration:
- Domain y Client ID configurados en el provider de Auth0
- Callback URLs configuradas correctamente
- Scopes necesarios: `openid profile email`

## Seguridad

- Validación de datos en frontend y backend
- Tokens JWT de Auth0 para autenticación
- Sanitización de inputs
- Manejo seguro de errores (no exponer información sensible) 