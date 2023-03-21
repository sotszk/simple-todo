/**
 * コンテナ要素の中身として bodyElement を挿入する
 * @param {Element} bodyElement コンテナ要素の中身となる要素
 * @param {Element} containerElement コンテナ要素
 */
export function render(bodyElement: Element, containerElement: Element): void {
  containerElement.innerHTML = '';
  containerElement.append(bodyElement);
}
