import { z } from 'zod'

// Base event schema
export const BaseEventSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  timestamp: z.date(),
  source: z.string(),
  data: z.unknown(),
})

export type BaseEvent = z.infer<typeof BaseEventSchema>

// Event handler type
export type EventHandler<T = unknown> = (event: BaseEvent & { data: T }) => Promise<void> | void

// Event bus interface
export interface EventBus {
  publish<T>(eventType: string, data: T, source?: string): Promise<void>
  subscribe<T>(eventType: string, handler: EventHandler<T>): () => void
  unsubscribe(eventType: string, handler: EventHandler): void
}
