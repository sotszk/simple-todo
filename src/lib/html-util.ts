export const escapeSpecialChars = (string_: string) => {
  return string_
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * HTML文字列からHTML要素を作る
 * @param html HTML文字列
 */
export const htmlToElement = (html: string) => {
  // @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/template
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.firstElementChild;
};

/**
 * HTML文字列からDOM Nodeを返すタグ関数
 */
export const element = (
  strings: TemplateStringsArray,
  ...values: Array<string | number>
) => {
  let htmlString = "";

  for (const [index, string] of strings.entries()) {
    const value = values[index - 1];
    htmlString +=
      typeof value === "string"
        ? escapeSpecialChars(value) + string
        : String(value) + string;
  }

  return htmlToElement(htmlString);
};

export const render = <T extends Element, U extends Element>(
  bodyElement: T,
  containerElement: U,
) => {
  containerElement.innerHTML = "";
  containerElement.append(bodyElement);
};
