import { type Config, ConfigSchema } from './types.js'

/**
 * Load configuration from environment variables
 */
export function loadConfig(): Config {
  const config = {
    environment: process.env.NODE_ENV || 'development',
    database: {
      url: process.env.DATABASE_URL || 'postgresql://localhost:5432/base_structure',
      poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '10', 10),
    },
    auth: {
      jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-min-32-chars-long',
      sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '3600', 10),
    },
    port: parseInt(process.env.PORT || '3000', 10),
  }

  return ConfigSchema.parse(config)
}

/**
 * Get configuration singleton
 */
let configInstance: Config | null = null

export function getConfig(): Config {
  if (!configInstance) {
    configInstance = loadConfig()
  }
  return configInstance
}

/**
 * Validate configuration without loading
 */
export function validateConfig(config: unknown): config is Config {
  return ConfigSchema.safeParse(config).success
}
