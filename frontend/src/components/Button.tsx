import { ButtonHTMLAttributes, ReactNode } from 'react'

export default function Button({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition ${className}`}
      {...props}
    >
      {children}
    </button>
  )
} 