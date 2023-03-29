import invariant from "tiny-invariant";

import { TodoListModel } from "./TodoListModel";
import { type TodoItemModel } from "./TodoItemModel";
import { TodoListView } from "./view/TodoListView";
import { render, element } from "./lib/html-util";

export class App {
  static create() {
    const app = new App();
    app.mount();
    return app;
  }

  #todoListModel = TodoListModel.create();
  #todoListView = TodoListView.create();

  // Factory パターン強制のため
  private constructor() {
    console.log("App initialized");
  }

  mount() {
    const formElement = document.querySelector<HTMLFormElement>("#js-form");
    const todoListContainerElement =
      document.querySelector<HTMLDivElement>("#js-todo-list");

    invariant(
      formElement !== null && todoListContainerElement !== null,
      "必要な要素がドキュメント上に存在していません",
    );

    this.#todoListModel.onChange((todoItems) => {
      const todoListElement = this.#todoListView.createElement(todoItems, {
        onUpdateTodo: this.#handleUpdateTodo,
        onDeleteTodo: this.#handleDeleteTodo,
      });

      render(todoListElement, todoListContainerElement);
      this.#renderTodoCount(this.#todoListModel.getTotalCount());
    });

    formElement.addEventListener("submit", (event_) => {
      event_.preventDefault();
      const inputItem = formElement.elements[0] as HTMLInputElement;
      if (!inputItem) {
        console.log("form item does not found");
        return;
      }

      this.#todoListModel.addTodo(inputItem.value);
      inputItem.value = "";
      inputItem.focus();
    });
  }

  #handleUpdateTodo(item: TodoItemModel) {
    this.#todoListModel.updateTodo(item);
  }

  #handleDeleteTodo(id: number) {
    this.#todoListModel.deleteTodo(id);
  }

  #renderTodoCount(count: number) {
    const countContainerElement =
      document.querySelector<HTMLElement>("#js-todo-count");
    invariant(countContainerElement !== null);

    const countElement = element`<span>Todoアイテム数: ${count}</span>`;
    invariant(countElement !== null);

    render(countElement, countContainerElement);
  }
}
