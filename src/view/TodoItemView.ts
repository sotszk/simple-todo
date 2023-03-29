import invariant from "tiny-invariant";

import { type TodoItemModel } from "../TodoItemModel";
import { element } from "../lib/html-util";

export type OnUpdateTodo = (
  todoItem: Pick<TodoItemModel, "id" | "completed">,
) => void;

export type OnDeleteTodo = (todoId: number) => void;

export class TodoItemView {
  static create() {
    return new TodoItemView();
  }

  // Factory パターン強制のため
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  /**
   * Todo アイテム要素を作成して返します
   * @param {TodoItemModel} todoItem TodoItemModel のインスタンス
   * @param {(todoItem: Pick<TodoItemModel, "id" | "completed">) => void} onUpdateTodo
   * @param {(todoId: number) => void} onDeleteTodo
   * @returns {Element} li 要素
   */
  createElement(
    todoItem: TodoItemModel,
    {
      onUpdateTodo,
      onDeleteTodo,
    }: {
      onUpdateTodo: OnUpdateTodo;
      onDeleteTodo: OnDeleteTodo;
    },
  ): Element {
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
