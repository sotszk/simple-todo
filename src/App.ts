console.log('App.ts: loaded');

export type TodoItem = {
  id: number;
  content: string;
  createdAt: number;
  completed: boolean;
};

export type AddedSubscribeEvent = {type: 'added'; callback: (item: TodoItem) => void};
export type DeletedSubscribeEvent = {type: 'deleted'; callback: (item: TodoItem) => void};
export type UpdatedSubscribeEvent = {type: 'updated'; callback: (item: TodoItem) => void};
export type CompletedSubscribeEvent = {type: 'completed'; callback: (id: number) => void};
export type SubscribeEvent = AddedSubscribeEvent | DeletedSubscribeEvent | UpdatedSubscribeEvent | CompletedSubscribeEvent;

function isAddedSubscribeEvent(event: SubscribeEvent): event is AddedSubscribeEvent {
  return event.type === 'added';
}

function isDeletedSubscribeEvent(event: SubscribeEvent): event is DeletedSubscribeEvent {
  return event.type === 'deleted';
}

function isUpdatedSubscribeEvent(event: SubscribeEvent): event is UpdatedSubscribeEvent {
  return event.type === 'updated';
}

function isCompletedSubscribeEvent(event: SubscribeEvent): event is CompletedSubscribeEvent {
  return event.type === 'completed';
}

export class App {
  #name: string;
  #currentId = 1;
  #subscribedEvents: SubscribeEvent[] = [];
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

  add(content: string) {
    const newItem = this.#createItem(content);
    this.items.push(newItem);

    for (const event of this.#subscribedEvents.filter(event => event.type === 'added')) {
      if (isAddedSubscribeEvent(event)) {
        event.callback(newItem);
      }
    }

    for (const event of this.#subscribedEvents.filter(event => event.type === 'updated')) {
      if (isUpdatedSubscribeEvent(event)) {
        event.callback(newItem);
      }
    }

    console.log('new item added', newItem);
  }

  complete(id: number) {
    this.items = this.items.map(item => (item.id === id ? {...item, completed: true} : item));

    for (const event of this.#subscribedEvents.filter(event => event.type === 'completed')) {
      if (isCompletedSubscribeEvent(event)) {
        event.callback(id);
      }
    }
  }

  uncomplete(id: number) {
    this.items = this.items.map(item => (item.id === id ? {...item, completed: false} : item));
  }

  delete(id: number) {
    const target = this.items.find(item => item.id === id);
    if (!target) {
      throw new Error('delete target does not found');
    }

    this.items = this.items.filter(item => item.id !== id);

    for (const event of this.#subscribedEvents.filter(event => event.type === 'deleted')) {
      if (isDeletedSubscribeEvent(event)) {
        event.callback(target);
      }
    }

    for (const event of this.#subscribedEvents.filter(event => event.type === 'updated')) {
      if (isUpdatedSubscribeEvent(event)) {
        event.callback(target);
      }
    }
  }

  getCount() {
    return this.items.length;
  }

  subscribe(event: SubscribeEvent) {
    this.#subscribedEvents.push(event);
  }

  unsubscribe(event: SubscribeEvent) {
    this.#subscribedEvents = this.#subscribedEvents.filter(evt => evt !== event);
  }
}
