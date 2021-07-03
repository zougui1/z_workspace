import { Log } from './Log';

export class ProfileLog<T extends Record<string, any>> extends Log<T> {

  profileLabel: string;
  timing?: string;

  constructor(profileLabel: string, values: T, code?: string) {
    super(values, code);

    this.profileLabel = profileLabel;
    this.setNamespace('profile');
  }

  setTiming(timing: string): this {
    this.timing = timing;
    return this;
  }
}
