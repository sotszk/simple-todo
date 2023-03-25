type Listener = () => void;
type EventListeners<T extends string> = Map<T, Set<Listener>>;

export class EventEmitter<EventName extends string = string> {
  #eventListeners: EventListeners<EventName> = new Map();

  addEventListener(eventName: EventName, listener: Listener) {
    const listeners = this.#eventListeners.get(eventName);
    if (listeners) {
      listeners.add(listener);
      return;
    }

    this.#eventListeners.set(eventName, new Set([listener]));
  }

  removeEventListener(eventName: EventName, listener: Listener) {
    const listeners = this.#eventListeners.get(eventName);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  emit(eventName: EventName) {
    const listeners = this.#eventListeners.get(eventName);
    if (!listeners) {
      return;
    }

    listeners.forEach((listener) => {
      listener.call(this);
    });
  }
}
