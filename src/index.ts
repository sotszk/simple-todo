import {App} from './App';

const app = new App();

console.log('App:', app.getName(), 'instance created');

function init() {
  const todoCountElement = document.querySelector<HTMLElement>('#js-todo-count');
  const formElement = document.querySelector<HTMLFormElement>('#js-form');

  if (!todoCountElement || !formElement) {
    console.log('necessary elements does not found');
    return;
  }

  function updateCount() {
    if (!todoCountElement?.textContent) {
      return;
    }

    const textSplitted = todoCountElement.textContent.split(':');
    textSplitted[1] = ` ${app.getCount()}`;
    todoCountElement.textContent = textSplitted.join(':');
  }

  updateCount();

  app.subscribe('count', () => {
    updateCount();
  });

  formElement.addEventListener('submit', evt => {
    evt.preventDefault();
    const inputItem = formElement.elements[0] as HTMLInputElement;
    if (!inputItem) {
      console.log('form item does not found');
      return;
    }

    app.add(inputItem.value);
    inputItem.value = '';
    inputItem.focus();
  });
}

init();
