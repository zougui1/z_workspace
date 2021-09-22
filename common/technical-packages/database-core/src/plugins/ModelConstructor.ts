import { Model } from 'objection';

export type ModelConstructor = new (...args: any[]) => Model;
