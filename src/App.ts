console.log('App.ts: loaded');

export class App {
  constructor() {
    console.log('App initialized');
  }

  get name() {
    return 'todo app';
  }
}
