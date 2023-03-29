import invariant from "tiny-invariant";

import { type TodoItemModel } from "../TodoItemModel";
import { element } from "../lib/html-util";

export class TodoItemView {
  createElement(
    todoItem: TodoItemModel,
    {
      onUpdateTodo,
      onDeleteTodo,
    }: {
      onUpdateTodo: (todoItem: TodoItemModel) => void;
      onDeleteTodo: (todoId: number) => void;
    },
  ) {
    const todoItemElement = element`<li></li>`;
    invariant(todoItemElement !== null);

    const checkboxElement = todoItem.completed
      ? element`<input type="checkbox" class="checkbox" checked>`
      : element`<input type="checkbox" class="checkbox">`;
    invariant(checkboxElement !== null);

    const deleteButtonElement = element`<button type="button" class="delete">x</button>`;
    invariant(deleteButtonElement !== null);

    todoItemElement.append(checkboxElement);
    todoItemElement.append(todoItem.content);
    todoItemElement.append(deleteButtonElement);

    todoItemElement
      .querySelector('input[type="checkbox"]')
      ?.addEventListener("change", (event_) => {
        const completed = (event_.target as HTMLInputElement).checked;
        onUpdateTodo({ ...todoItem, completed });
      });

    todoItemElement
      .querySelector(".delete")
      ?.addEventListener("click", (event_) => {
        event_.preventDefault();
        onDeleteTodo(todoItem.id);
      });

    return todoItemElement;
  }
}
