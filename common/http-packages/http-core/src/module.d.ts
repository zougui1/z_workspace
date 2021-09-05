declare module 'template-url' {
  // the type is taken into account only with `:`, however, typescript requires `=>`
  // so using both solves both issues
  export default (url: string, params: Record<string, string>): string => string;
}
