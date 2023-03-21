console.log('App.ts: loaded');

export type TodoItem = {
  id: number;
  content: string;
  createdAt: number;
  completed: boolean;
};

export type UpdatedSubscribeEvent = {type: 'updated'; callback: (item: TodoItem) => void};
export type CompletedSubscribeEvent = {type: 'completed'; callback: (id: number) => void};
export type SubscribeEvent = UpdatedSubscribeEvent | CompletedSubscribeEvent;

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

  mount() {
    const todoCountElement = document.querySelector<HTMLElement>('#js-todo-count');
    const formElement = document.querySelector<HTMLFormElement>('#js-form');
    const todoListContainerElement = document.querySelector<HTMLDivElement>('#js-todo-list');

    if (!todoCountElement || !formElement || !todoListContainerElement) {
      console.log('necessary elements does not found');
      return;
    }

    todoListContainerElement.innerHTML = '<ul></ul>';

    const updateCount = () => {
      if (!todoCountElement?.textContent) {
        return;
      }

      const textSplitted = todoCountElement.textContent.split(':');
      textSplitted[1] = ` ${this.getCount()}`;
      todoCountElement.textContent = textSplitted.join(':');
    };

    updateCount();

    this.subscribe({type: 'updated', callback: () => {
      // this.items 更新時に DOM をまとめて入れ替える
      const todoItemListElement = `<ul>${this.items.reduce((html, item) => html + `<li>${item.content}</li>`, '')}</ul>`;
      todoListContainerElement.innerHTML = todoItemListElement;

      // それぞれの li 要素に対してチェックボックスと削除ボタンの要素を追加する
      for (const [index, item] of this.items.entries()) {
        const todoItemElement = todoListContainerElement.lastElementChild?.children[index];
        if (!todoItemElement) return;

        // 要素を追加
        todoItemElement.innerHTML = (item.completed ? `<input type="checkbox" class="checkbox" checked>${item.content}` : `<input type="checkbox" class="checkbox">${item.content}`) + '<button type="button" class="delete">×</button>';

        todoItemElement.querySelector('input[type="checkbox"]')?.addEventListener('change', evt => {
          console.log((evt.target as HTMLInputElement).checked);
          if ((evt.target as HTMLInputElement).checked) {
            this.complete(item.id);
          } else {
            this.uncomplete(item.id);
          }
        });

        todoItemElement.querySelector('.delete')?.addEventListener('click', evt => {
          evt.preventDefault();
          this.delete(item.id);
        });
      }

      console.log('current items:', this.items);
      updateCount();
    }});

    this.subscribe({type: 'completed', callback(id) {
      console.log(`item id ${id} completed`);
    }});

    formElement.addEventListener('submit', evt => {
      evt.preventDefault();
      const inputItem = formElement.elements[0] as HTMLInputElement;
      if (!inputItem) {
        console.log('form item does not found');
        return;
      }

      this.add(inputItem.value);
      inputItem.value = '';
      inputItem.focus();
    });
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
