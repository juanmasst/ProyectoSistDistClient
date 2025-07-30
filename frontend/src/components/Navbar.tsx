import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUserRegistration } from "../hooks/useUserRegistration";

export default function Navbar() {
  const { isAuthenticated, login, logout, user } = useAuth();
  const { needsRegistration } = useUserRegistration();

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-4 py-3 dark:bg-gray-900/95 dark:border-gray-700/50 sticky top-0 z-50 shadow-sm">
      <div className="container max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
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
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
              Foro Chat
            </span>
          </Link>

          {/* Navegación y acciones */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Enlaces de navegación */}
            <div className="hidden sm:flex items-center space-x-1">
              <Link
                to="/"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 dark:text-gray-200 dark:hover:text-blue-400 dark:hover:bg-blue-900/20"
              >
                <div className="flex items-center space-x-2">
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span>Inicio</span>
                </div>
              </Link>

              {isAuthenticated && !needsRegistration && (
                <Link
                  to="/profile"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 dark:text-gray-200 dark:hover:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  <div className="flex items-center space-x-2">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Perfil</span>
                  </div>
                </Link>
              )}
            </div>

            {/* Badge de registro pendiente */}
            {isAuthenticated && needsRegistration && (
              <Link
                to="/register"
                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-amber-800 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 rounded-full hover:from-amber-200 hover:to-yellow-200 transition-all duration-200 dark:from-amber-900/30 dark:to-yellow-900/30 dark:text-amber-200 dark:border-amber-700 dark:hover:from-amber-900/50 dark:hover:to-yellow-900/50 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <svg
                  className="w-3 h-3 mr-1.5"
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
                Completar Registro
              </Link>
            )}

            {/* Botones de autenticación */}
            {!isAuthenticated ? (
              <button
                onClick={login}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Iniciar Sesión
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Avatar del usuario */}
                {user && (
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <img
                      src={user.picture}
                      alt={user.name || "Usuario"}
                      className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-600 shadow-sm"
                    />
                    <div className="hidden sm:block">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate max-w-24">
                        {user.name || "Usuario"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        En línea
                      </p>
                    </div>
                  </div>
                )}

                {/* Botón de logout */}
                <button
                  onClick={logout}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  <svg
                    className="w-4 h-4 mr-1 sm:mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
