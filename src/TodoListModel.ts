import { EventEmitter } from "./lib/EventEmitter";
import { TodoItemModel } from "./TodoItemModel";

export class TodoListModel extends EventEmitter<"change"> {
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

  updateTodo({ id, completed }: Pick<TodoItemModel, "id" | "completed">) {
    const targetItemIndex = this.#todoItems.findIndex((item) => item.id === id);
    if (targetItemIndex < 0) {
      console.log("該当の todo item が見つかりませんでした");
      return;
    }

    this.#todoItems[targetItemIndex] = {
      ...this.#todoItems[targetItemIndex],
      completed,
    };
    this.emitChange();
  }

  deleteTodo(id: number) {
    const targetItemIndex = this.#todoItems.findIndex((item) => item.id === id);
    if (targetItemIndex < 0) {
      console.log("該当の todo item が見つかりませんでした");
      return;
    }

    this.#todoItems.splice(targetItemIndex, 1);
    this.emitChange();
  }

  onChange(handleChange: (items: TodoItemModel[]) => void) {
    this.addEventListener("change", () => {
      handleChange(this.#todoItems);
    });
  }

  emitChange() {
    this.emit("change");
  }
}
