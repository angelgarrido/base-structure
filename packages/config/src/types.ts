import { z } from 'zod'

// Environment configuration schema
export const EnvironmentSchema = z.enum(['development', 'staging', 'production'])
export type Environment = z.infer<typeof EnvironmentSchema>

// Database configuration schema
export const DatabaseConfigSchema = z.object({
  url: z.string().url(),
  poolSize: z.number().min(1).max(20).default(10),
})

export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>

// Auth configuration schema
export const AuthConfigSchema = z.object({
  jwtSecret: z.string().min(32),
  sessionTimeout: z.number().min(300).default(3600), // 1 hour default
})

export type AuthConfig = z.infer<typeof AuthConfigSchema>

// Main configuration schema
export const ConfigSchema = z.object({
  environment: EnvironmentSchema,
  database: DatabaseConfigSchema,
  auth: AuthConfigSchema,
  port: z.number().min(1).max(65535).default(3000),
})

export type Config = z.infer<typeof ConfigSchema>
