import type { BaseComponentProps, ButtonSize, ButtonVariant } from './types.js'

// Button component
export interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  onClick?: () => void
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors'
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  }
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

// Card component
export interface CardProps extends BaseComponentProps {
  title?: string
}

export function Card({ children, title, className = '', ...props }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`} {...props}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  )
}

// Container component
export interface ContainerProps extends BaseComponentProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export function Container({ children, maxWidth = 'lg', className = '', ...props }: ContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }

  return (
    <div className={`mx-auto px-4 ${maxWidthClasses[maxWidth]} ${className}`} {...props}>
      {children}
    </div>
  )
}
