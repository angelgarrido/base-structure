import { randomUUID } from 'node:crypto'
import type { BaseEvent, EventBus, EventHandler } from './types.js'

// Simple in-memory event bus implementation
class InMemoryEventBus implements EventBus {
  private handlers = new Map<string, Set<EventHandler>>()

  async publish<T>(eventType: string, data: T, source = 'unknown'): Promise<void> {
    const event: BaseEvent = {
      id: randomUUID(),
      type: eventType,
      timestamp: new Date(),
      source,
      data,
    }

    const handlers = this.handlers.get(eventType)
    if (handlers) {
      const promises = Array.from(handlers).map((handler) =>
        Promise.resolve(handler(event as BaseEvent & { data: T })),
      )
      await Promise.all(promises)
    }
  }

  subscribe<T>(eventType: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set())
    }

    const handlers = this.handlers.get(eventType)
    if (handlers) {
      handlers.add(handler as EventHandler)
    }

    // Return unsubscribe function
    return () => this.unsubscribe(eventType, handler as EventHandler)
  }

  unsubscribe(eventType: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventType)
    if (handlers) {
      handlers.delete(handler)
      if (handlers.size === 0) {
        this.handlers.delete(eventType)
      }
    }
  }
}

// Global event bus instance
let eventBus: EventBus | null = null

export function getEventBus(): EventBus {
  if (!eventBus) {
    eventBus = new InMemoryEventBus()
  }
  return eventBus
}

export { InMemoryEventBus }
