export const JsonColumn = () => {
  return function JsonColumnDecorator(target: any, property: string) {
    target.constructor.jsonAttributes ??= [];
    target.constructor.jsonAttributes.push(property);;
  }
}
