import invariant from "tiny-invariant";

import { TodoListModel } from "./TodoListModel";
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

    todoList.onChange((todoItems) => {
      // This.items 更新時に DOM をまとめて入れ替える
      const todoListElement = element`<ul></ul>`;
      invariant(todoListElement !== null);

      // リストにTODOアイテム要素を追加する
      for (const item of todoItems) {
        const todoItemElement = element`<li></li>`;
        invariant(todoItemElement !== null);

        const checkboxElement = item.completed
          ? element`<input type="checkbox" class="checkbox" checked>`
          : element`<input type="checkbox" class="checkbox">`;
        invariant(checkboxElement !== null);

        const deleteButtonElement = element`<button type="button" class="delete">x</button>`;
        invariant(deleteButtonElement !== null);

        todoItemElement.append(checkboxElement);
        todoItemElement.append(item.content);
        todoItemElement.append(deleteButtonElement);
        todoListElement.append(todoItemElement);

        todoItemElement
          .querySelector('input[type="checkbox"]')
          ?.addEventListener("change", (event_) => {
            if ((event_.target as HTMLInputElement).checked) {
              todoList.updateTodo({ ...item, completed: true });
            } else {
              todoList.updateTodo({ ...item, completed: false });
            }
          });

        todoItemElement
          .querySelector(".delete")
          ?.addEventListener("click", (event_) => {
            event_.preventDefault();
            todoList.deleteTodo(item.id);
          });
      }

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
