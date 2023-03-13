import type { Hello } from "./hello";
import { add } from "./lib/add";

const hello: Hello = "Hello, world!";
const myHello: string = hello;

console.log(myHello, add(10));

const helloEl = document.querySelector<HTMLHeadingElement>(".hello");

if (helloEl) {
  helloEl.textContent = myHello;
}
