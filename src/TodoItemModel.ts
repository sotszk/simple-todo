let incrementalId = 0;

export class TodoItemModel {
  static create(content: string) {
    return new TodoItemModel(content);
  }

  id: number;
  content: string;
  createdAt = Date.now;
  completed = false;

  private constructor(content: string) {
    incrementalId++;
    this.id = incrementalId;
    this.content = content;
  }
}
