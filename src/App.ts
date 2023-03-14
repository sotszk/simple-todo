console.log('App.ts: loaded');

export type TodoItem = {
  id: number;
  content: string;
  createdAt: number;
  completed: boolean;
};

export type SubscribableEventType = 'count';

export class App {
  #name: string;
  #currentId = 1;
  #subscribedPropEvents: Array<{type: SubscribableEventType; callback: () => void}> = [];
  items: TodoItem[] = [];

  constructor({name = 'Todo App'}: {name?: string} = {}) {
    this.#name = name;

    console.log('App initialized');
  }

  getName() {
    return this.#name;
  }

  #incrementId() {
    this.#currentId++;
  }

  #createItem(content: string) {
    const item: TodoItem = {
      id: this.#currentId,
      createdAt: Date.now(),
      content,
      completed: false,
    };
    this.#incrementId();
    return item;
  }

  #isSubscribed(eventType: SubscribableEventType) {
    return this.#subscribedPropEvents.some(event => event.type === eventType);
  }

  add(content: string) {
    const newItem = this.#createItem(content);
    this.items.push(newItem);

    if (this.#isSubscribed('count')) {
      const {callback} = this.#subscribedPropEvents.find(event => event.type === 'count') ?? {};
      callback?.();
    }

    console.log('new item added', newItem);
  }

  complete(id: number) {
    this.items = this.items.map(item => (item.id === id ? {...item, complete: true} : item));
  }

  delete(id: number) {
    this.items = this.items.filter(item => item.id !== id);
  }

  getCount() {
    return this.items.length;
  }

  subscribe(eventType: 'count', callback: () => void) {
    if (this.#isSubscribed(eventType)) {
      return;
    }

    this.#subscribedPropEvents.push({
      type: eventType,
      callback,
    });
  }
}
