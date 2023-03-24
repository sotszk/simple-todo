import { TodoListModel } from "./TodoListModel";

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

    if (!formElement || !todoListContainerElement) {
      throw new Error("necessary elements do not found");
    }

    const todoList = TodoListModel.create();

    todoList.onChange((todoItems) => {
      // This.items 更新時に DOM をまとめて入れ替える
      const todoItemListElement = `<ul>${todoItems.reduce(
        (html, item) => html + `<li>${item.content}</li>`,
        "",
      )}</ul>`;
      todoListContainerElement.innerHTML = todoItemListElement;

      // それぞれの li 要素に対してチェックボックスと削除ボタンの要素を追加する
      for (const [index, item] of todoItems.entries()) {
        const todoItemElement =
          todoListContainerElement.lastElementChild?.children[index];
        if (!todoItemElement) return;

        todoItemElement.innerHTML =
          (item.completed
            ? `<input type="checkbox" class="checkbox" checked>${item.content}`
            : `<input type="checkbox" class="checkbox">${item.content}`) +
          '<button type="button" class="delete">×</button>';

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

      const todoCountElement =
        document.querySelector<HTMLElement>("#js-todo-count");
      if (todoCountElement?.textContent) {
        const textSplitted = todoCountElement.textContent.split(":");
        textSplitted[1] = ` ${todoList.getTotalCount()}`;
        todoCountElement.textContent = textSplitted.join(":");
      }
    });

    todoListContainerElement.innerHTML = "<ul></ul>";

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
