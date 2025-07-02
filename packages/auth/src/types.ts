import { z } from 'zod'

// User session schema
export const UserSessionSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['user', 'admin']).default('user'),
  permissions: z.array(z.string()).default([]),
})

export type UserSession = z.infer<typeof UserSessionSchema>

// Auth token schema
export const AuthTokenSchema = z.object({
  token: z.string(),
  expiresAt: z.date(),
  userId: z.string(),
})

export type AuthToken = z.infer<typeof AuthTokenSchema>

// Login credentials schema
export const LoginCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>
