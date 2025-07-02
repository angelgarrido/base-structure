import type { ReactNode } from 'react'

// Common UI component props
export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

// Input types
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// Color variants
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
