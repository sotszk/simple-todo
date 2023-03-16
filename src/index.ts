import {App} from './App';
import type {AddedSubscribeEvent, UpdatedSubscribeEvent} from './App';

const app = new App();

console.log('App:', app.getName(), 'instance created');

function init() {
  const todoCountElement = document.querySelector<HTMLElement>('#js-todo-count');
  const formElement = document.querySelector<HTMLFormElement>('#js-form');
  const todoListElement = document.querySelector<HTMLDivElement>('#js-todo-list');

  if (!todoCountElement || !formElement || !todoListElement) {
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

  const updateCountSubscribeEvent: UpdatedSubscribeEvent = {type: 'updated', callback() {
    updateCount();
  }};

  const appendTodoElementSubscribeEvent: AddedSubscribeEvent = {type: 'added', callback(item) {
    const newElement = document.createElement('div');
    newElement.textContent = item.content;
    newElement.id = `todo-item-${item.id}`;

    const checkboxElement = document.createElement('input');
    checkboxElement.setAttribute('type', 'checkbox');
    checkboxElement.addEventListener('change', evt => {
      evt.preventDefault();
      const checked = (evt.target as HTMLInputElement).checked;
      checkboxElement.checked = checked;
      if (checked) {
        app.complete(item.id);
      } else {
        app.uncomplete(item.id);
      }
    });

    const deleteButtonElement = document.createElement('button');
    deleteButtonElement.textContent = '削除';
    deleteButtonElement.setAttribute('type', 'button');
    deleteButtonElement.addEventListener('click', evt => {
      evt.preventDefault();
      app.delete(item.id);
    });

    newElement.append(checkboxElement);
    newElement.append(deleteButtonElement);
    todoListElement.append(newElement);
  }};

  app.subscribe(updateCountSubscribeEvent);
  app.subscribe(appendTodoElementSubscribeEvent);

  app.subscribe({type: 'deleted', callback(item) {
    document.querySelector(`#todo-item-${item.id}`)?.remove();
  }});

  app.subscribe({type: 'updated', callback() {
    console.log('current items:', app.items);
  }});

  app.subscribe({type: 'completed', callback(id) {
    console.log(`item id ${id} completed`);
  }});

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
