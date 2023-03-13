import type {Hello} from './hello';
import {add} from './lib/add';

const hello: Hello = 'Hello, world!';
const myHello: string = hello;

console.log(myHello, add(10));

const helloElement = document.querySelector<HTMLHeadingElement>('.hello');

if (helloElement) {
  helloElement.textContent = myHello;
}
