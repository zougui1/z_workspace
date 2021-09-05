import { Element, IElementQueryOptions } from './Element';

export class ElementCollection {

  protected _elements: Element[] = [];

  constructor(elements: Element[]) {
    this._elements = Array.from(new Set(elements));
  }

  //#region queries
  getElementsByTagName(tagName: string, options: IElementQueryOptions = {}): ElementCollection {
    const collections = this._elements.flatMap(el => el.getElementsByTagName(tagName, options));

    if (!collections.length) {
      return new ElementCollection([]);
    }

    return collections[0].concat(...collections.slice(1));
  }

  getSingleElementByTagName(tagName: string, options: IElementQueryOptions = {}): Element | undefined {
    for (const element of this._elements) {
      const foundElement = element.getSingleElementByTagName(tagName, options);

      if (foundElement) {
        return foundElement;
      }
    }
  }

  getElementsByClassName(className: string, options: IElementQueryOptions = {}): ElementCollection {
    const collections = this._elements.flatMap(el => el.getElementsByClassName(className, options));

    if (!collections.length) {
      return new ElementCollection([]);
    }

    return collections[0].concat(...collections.slice(1));
  }

  getSingleElementByClassName(className: string, options: IElementQueryOptions = {}): Element | undefined {
    for (const element of this._elements) {
      const foundElement = element.getSingleElementByClassName(className, options);

      if (foundElement) {
        return foundElement;
      }
    }
  }

  querySelector(selector: string, options: IElementQueryOptions = {}): Element | null {
    for (const element of this._elements) {
      const foundElement = element.querySelector(selector, options);

      if (foundElement) {
        return foundElement;
      }
    }

    return null;
  }

  querySelectorAll(selector: string, options: IElementQueryOptions = {}): ElementCollection {
    const collections = this._elements.flatMap(el => el.querySelectorAll(selector, options));

    if (!collections.length) {
      return new ElementCollection([]);
    }

    return collections[0].concat(...collections.slice(1));
  }
  //#endregion

  //#region basic array methods
  map<T>(iteratee: (value: Element, index: number, source: Element[]) => T): T[] {
    return this._elements.map(iteratee);
  }

  flatMap<T>(iteratee: (value: Element, index: number, source: Element[]) => T | readonly T[]): T[] {
    return this._elements.flatMap(iteratee);
  }

  filter(iteratee: (value: Element, index: number, source: Element[]) => any): ElementCollection {
    return new ElementCollection(this._elements.filter(iteratee));
  }

  forEach(iteratee: (value: Element, index: number, source: Element[]) => any): this {
    this._elements.forEach(iteratee);
    return this;
  }

  find(iteratee: (value: Element, index: number, source: Element[]) => any): Element | undefined {
    return this._elements.find(iteratee);
  }

  push(element: Element): this {
    this._elements.push(element);
    return this;
  }

  concat(...collections: ElementCollection[]): ElementCollection {
    return new ElementCollection(this._elements.concat(...collections.map(col => col._elements)));
  }
  //#endregion

  toArray(): Element[] {
    return this._elements.slice();
  }

  get(index: number): Element | undefined {
    return this._elements[index];
  }

  first(): Element | undefined {
    return this._elements[0];
  }

  last(): Element | undefined {
    return this._elements[this._elements.length - 1];
  }
}
