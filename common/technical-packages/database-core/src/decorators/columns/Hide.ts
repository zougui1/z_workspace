export const Hide = () => {
  return function HideDecorator(target: any, property: string) {
    target.constructor.hidden ??= [];
    target.constructor.hidden.push(property);;
  }
}
