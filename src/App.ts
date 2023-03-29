import invariant from "tiny-invariant";

import { TodoListModel } from "./TodoListModel";
import { TodoListView } from "./view/TodoListView";
import { render, element } from "./lib/html-util";

export class App {
  static create() {
    const app = new App();
    app.mount();
    return app;
  }

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

    const todoList = TodoListModel.create();
    const todoListView = TodoListView.create();

    todoList.onChange((todoItems) => {
      const todoListElement = todoListView.createElement(todoItems, {
        onUpdateTodo(item) {
          todoList.updateTodo(item);
        },
        onDeleteTodo(id) {
          todoList.deleteTodo(id);
        },
      });

      render(todoListElement, todoListContainerElement);

      const countContainerElement =
        document.querySelector<HTMLElement>("#js-todo-count");
      invariant(countContainerElement !== null);

      const countElement = element`<span>Todoアイテム数: ${todoList.getTotalCount()}</span>`;
      invariant(countElement !== null);

      render(countElement, countContainerElement);
    });

    formElement.addEventListener("submit", (event_) => {
      event_.preventDefault();
      const inputItem = formElement.elements[0] as HTMLInputElement;
      if (!inputItem) {
        console.log("form item does not found");
        return;
      }

      todoList.addTodo(inputItem.value);
      inputItem.value = "";
      inputItem.focus();
    });
  }
}
