import { Widgets } from 'blessed';

declare module 'react-blessed' {
  export interface BlessedIntrinsicElements {
    form: DetailedBlessedProps<Widgets.FormElement<any>>;
  }
}
