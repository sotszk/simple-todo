console.log('App.ts: loaded');

let incrementalId = 0;

export type TodoItem = {
  id: number;
  content: string;
  createdAt: number;
  completed: boolean;
};

export class EventEmitter {
  #eventListeners = new Set<Map<string, () => void>>([]);

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

export class TodoListModel extends EventEmitter {
  #todoItems: TodoItem[] = [];

  getTotalCount() {
    return this.#todoItems.length;
  }

  getAllItems() {
    return this.#todoItems;
  }

  addTodo(content: string) {
    incrementalId += 1;

    this.#todoItems.push({
      id: incrementalId,
      content,
      completed: false,
      createdAt: Date.now(),
    });
    this.emitChange();
  }

  updateTodo({id, content, completed}: TodoItem) {
    const targetItemIndex = this.#todoItems.findIndex(item => item.id === id);
    if (targetItemIndex < 0) {
      console.log('該当の todo item が見つかりませんでした');
      return;
    }

    this.#todoItems[targetItemIndex] = {...this.#todoItems[targetItemIndex], completed, content};
    this.emitChange();
  }

  deleteTodo(id: number) {
    this.#todoItems = this.#todoItems.filter(item => item.id !== id);
    this.emitChange();
  }

  onChange(listener: (items: TodoItem[]) => void) {
    this.addEventListener('change', () => {
      listener(this.#todoItems);
    });
  }

  emitChange() {
    this.emit('change');
  }
}

export class App {
  static create() {
    const app = new App();
    app.mount();
    return app;
  }

  private constructor() {
    console.log('App initialized');
  }

  mount() {
    const formElement = document.querySelector<HTMLFormElement>('#js-form');
    const todoListContainerElement = document.querySelector<HTMLDivElement>('#js-todo-list');

    if (!formElement || !todoListContainerElement) {
      throw new Error('necessary elements do not found');
    }

    const todoList = new TodoListModel();

    todoList.onChange(todoItems => {
      // this.items 更新時に DOM をまとめて入れ替える
      const todoItemListElement = `<ul>${todoItems.reduce((html, item) => html + `<li>${item.content}</li>`, '')}</ul>`;
      todoListContainerElement.innerHTML = todoItemListElement;

      // それぞれの li 要素に対してチェックボックスと削除ボタンの要素を追加する
      for (const [index, item] of todoItems.entries()) {
        const todoItemElement = todoListContainerElement.lastElementChild?.children[index];
        if (!todoItemElement) return;

        // 要素を追加
        todoItemElement.innerHTML = (item.completed ? `<input type="checkbox" class="checkbox" checked>${item.content}` : `<input type="checkbox" class="checkbox">${item.content}`) + '<button type="button" class="delete">×</button>';

        todoItemElement.querySelector('input[type="checkbox"]')?.addEventListener('change', evt => {
          console.log((evt.target as HTMLInputElement).checked);
          if ((evt.target as HTMLInputElement).checked) {
            todoList.updateTodo({...item, completed: true});
          } else {
            todoList.updateTodo({...item, completed: false});
          }
        });

        todoItemElement.querySelector('.delete')?.addEventListener('click', evt => {
          evt.preventDefault();
          todoList.deleteTodo(item.id);
        });
      }

      const todoCountElement = document.querySelector<HTMLElement>('#js-todo-count');
      if (todoCountElement?.textContent) {
        const textSplitted = todoCountElement.textContent.split(':');
        textSplitted[1] = ` ${todoList.getTotalCount()}`;
        todoCountElement.textContent = textSplitted.join(':');
      }
    });

    todoListContainerElement.innerHTML = '<ul></ul>';

    formElement.addEventListener('submit', evt => {
      evt.preventDefault();
      const inputItem = formElement.elements[0] as HTMLInputElement;
      if (!inputItem) {
        console.log('form item does not found');
        return;
      }

      todoList.addTodo(inputItem.value);
      inputItem.value = '';
      inputItem.focus();
    });
  }
}
