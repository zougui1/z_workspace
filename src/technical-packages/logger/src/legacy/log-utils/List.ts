export class List<T> {

  readonly label: string;
  readonly items: T[]

  constructor(label: string, items: T[]) {
    this.label = label;
    this.items = items;
  }
}
