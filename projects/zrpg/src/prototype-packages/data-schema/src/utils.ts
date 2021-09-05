import { Arrayable } from '@zougui/types';

export type PickOne<T> = Arrayable<Branchable<Pickable<Branchable<T>>>>;

export interface Picker<T> {
  $pick: {
    $resolve: 'single' | 'multiple';
    $options: (PickOption<T> | Branch<PickOption<T>>)[];
  };
}

export type Pickable<T> = T | Picker<T>;

export interface PickOption<T> {
  $value: T;
  $chance: number;
}

export interface Conditional<T> {
  $cond: Arrayable<Condition>;
  $then: T;
}

export interface Branch<T> {
  $if: Conditional<T>;
  '$else if'?: Arrayable<Conditional<T>>;
   $else?: T;
}

export type Branchable<T> = T | Branch<PickOne<T>>;

// TODO
export interface Condition {

}
