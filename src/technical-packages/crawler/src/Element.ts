import { ElementCollection } from './ElementCollection';

export class Element {

  element: cheerio.TagElement;
  //#region lazy properties
  protected _textContent?: string;
  protected _children?: ElementCollection;
  //#endregion

  constructor(element: cheerio.TagElement) {
    this.element = element;
  }

  //#region queries
  getElementsByTagName(tagName: string, options: IElementQueryOptions = {}): ElementCollection {
    const foundChildren = this.children.filter(element => element.name === tagName && this.baseQueryMatcher(options));
    const foundElements = this.children.getElementsByTagName(tagName, options);

    return foundChildren.concat(foundElements);
  }

  getSingleElementByTagName(tagName: string, options: IElementQueryOptions = {}): Element | undefined {
    const foundChild = this.children.find(element => element.name === tagName && this.baseQueryMatcher(options));
    const foundElement = foundChild ?? this.children.getSingleElementByTagName(tagName, options);

    return foundElement;
  }

  getElementsByClassName(className: string, options: IElementQueryOptions = {}): ElementCollection {
    const foundChildren = this.children.filter(element => element.hasClass(className) && this.baseQueryMatcher(options));
    const foundElements = this.children.getElementsByClassName(className, options);

    return foundChildren.concat(foundElements);
  }

  getSingleElementByClassName(className: string, options: IElementQueryOptions = {}): Element | undefined {
    const foundChild = this.children.find(element => element.hasClass(className) && this.baseQueryMatcher(options));
    const foundElement = foundChild ?? this.children.getSingleElementByClassName(className, options);

    return foundElement;
  }

  querySelector(selector: string, options: IElementQueryOptions = {}): Element | undefined {
    const selectorKind = selector[0];

    if (selectorKind === '.') {
      return this.getSingleElementByClassName(selector, options);
    }

    if (selectorKind === '#') {
      throw new Error('Select by ID is not supported yet.');
    }

    return this.getSingleElementByTagName(selector, options);
  }

  querySelectorAll(selector: string, options: IElementQueryOptions = {}): ElementCollection {
    const selectorKind = selector[0];

    if (selectorKind === '.') {
      return this.getElementsByClassName(selector, options);
    }

    if (selectorKind === '#') {
      throw new Error('Select by ID is not supported yet.');
    }

    return this.getElementsByTagName(selector, options);
  }

  protected baseQueryMatcher(options: IElementQueryOptions = {}): boolean {
    if (!options.text) {
      return true;
    }

    return this.matchTextContent(options.text);
  }
  //#endregion

  //#region helper methods
  hasClass(className: string): boolean {
    const elementClasses = this.element.attribs.class;

    if (typeof elementClasses !== 'string') {
      return false;
    }

    //console.log('match:', className, 'against:', elementClasses.split(' '), '=', elementClasses.split(' ').includes(className));

    return elementClasses.split(' ').includes(className);
  }

  matchTextContent(textContent: string | RegExp): boolean {
    return typeof textContent === 'string'
      ? this.textContent.includes(textContent)
      : textContent.test(this.textContent);
  }
  //#endregion

  //#region lazy getters
  get textContent(): string {
    this._textContent ??= this.element.children
      .filter(element => element.type === 'text')
      .map(element => element.data ?? '')
      .concat(this.children.map(child => child.textContent))
      .join('\n');

    return this._textContent;
  }

  get children(): ElementCollection {
    const tagChildren = this.element.children.filter(element => element.type === 'tag') as cheerio.TagElement[];
    const childrenElements = tagChildren.map(element => new Element(element));

    return this._children ??= new ElementCollection(childrenElements);
  }
  //#endregion

  //#region cheerio element's getters
  get name(): string {
    return this.element.name;
  }

  get attributes(): Record<string, string> {
    return this.element.attribs;
  }
  //#endregion
}

export interface IElementQueryOptions {
  text?: string | RegExp;
}
