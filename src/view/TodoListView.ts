import invariant from "tiny-invariant";

import { TodoItemView } from "./TodoItemView";
import type { OnDeleteTodo, OnUpdateTodo } from "./TodoItemView";
import { type TodoItemModel } from "../TodoItemModel";
import { element } from "../lib/html-util";

export class TodoListView {
  static create() {
    return new TodoListView();
  }

  // Factory パターン強制のため
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  createElement(
    todoItems: TodoItemModel[],
    {
      onUpdateTodo,
      onDeleteTodo,
    }: {
      onUpdateTodo: OnUpdateTodo;
      onDeleteTodo: OnDeleteTodo;
    },
  ) {
    // This.items 更新時に DOM をまとめて入れ替える
    const todoListElement = element`<ul></ul>`;
    invariant(todoListElement !== null);

    const todoItemView = TodoItemView.create();

    // リストにTODOアイテム要素を追加する
    for (const item of todoItems) {
      const todoItemElement = todoItemView.createElement(item, {
        onUpdateTodo,
        onDeleteTodo,
      });

      todoListElement.append(todoItemElement);
    }

    return todoListElement;
  }
}
