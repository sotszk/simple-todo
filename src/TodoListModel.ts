import {EventEmitter} from './lib/EventEmitter';
import {TodoItemModel} from './TodoItemModel';

export class TodoListModel extends EventEmitter {
  static create() {
    return new TodoListModel();
  }

  #todoItems: TodoItemModel[] = [];

  private constructor() {
    super();
  }

  getTotalCount() {
    return this.#todoItems.length;
  }

  getAllItems() {
    return this.#todoItems;
  }

  addTodo(content: string) {
    this.#todoItems.push(TodoItemModel.create(content));
    this.emitChange();
  }

  updateTodo({id, content, completed}: TodoItemModel) {
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

  onChange(listener: (items: TodoItemModel[]) => void) {
    this.addEventListener('change', () => {
      listener(this.#todoItems);
    });
  }

  emitChange() {
    this.emit('change');
  }
}
