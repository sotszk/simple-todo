export class EventEmitter<EventNames extends string[] = string[]> {
  #eventListeners = new Set<Map<EventNames[number], () => void>>([]);

  addEventListener(eventName: 'change', callback: () => void) {
    const eventListener = new Map();
    eventListener.set(eventName, callback);
    this.#eventListeners.add(eventListener);
  }

  emit(eventName: 'change') {
    this.#eventListeners.forEach(listener => {
      listener.get(eventName)?.();
    });
  }
}
