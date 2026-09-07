/** Small observable value with no dependency on the removed client-runtime. */
export interface SnapshotStore<T> {
  getSnapshot(): T
  subscribe(listener: () => void): () => void
}

export function createSnapshotStore<T>(initial: T): SnapshotStore<T> & { set(value: T): void } {
  let value = initial
  const listeners = new Set<() => void>()
  return {
    getSnapshot: () => value,
    subscribe(listener) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    set(next) {
      if (Object.is(value, next)) return
      value = next
      for (const listener of listeners) listener()
    },
  }
}
