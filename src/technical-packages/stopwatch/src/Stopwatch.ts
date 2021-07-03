import prettyMs from 'pretty-ms';

export class Stopwatch {

  //#region properties
  private _start: [number, number] | undefined;
  private _current: [number, number] | undefined;
  public timings: Record<string, number> = {};
  //#endregion

  //#region methods
  start(): this {
    this._start = this._current = process.hrtime();
    return this;
  }

  lap(label: string): this {
    if (!this._current) {
      throw new Error('The stopwatch can only lap when running.');
    }

    const hrtime = process.hrtime(this._current);
    this._current = process.hrtime();
    this.timings[label] = this.getMilliseconds(hrtime);

    return this;
  }

  stop(options?: { raw?: false }): Record<string, string>;
  stop(options: { raw: true }): Record<string, number>;
  stop(options?: { raw?: boolean }): Record<string, string | number> {
    if (!this._start) {
      throw new Error('The stopwatch can only stop when running.');
    }

    this.timings.total = this.getMilliseconds(process.hrtime(this._start));

    if (options?.raw) {
      return this.timings;
    }

    const formattedTimings = Object.entries(this.timings).reduce((timings, [key, timing]) => {
      timings[key] = prettyMs(timing);
      return timings;
    }, {} as Record<string, string>);

    return formattedTimings;
  }
  //#endregion

  //#region private methods
  private getMilliseconds([seconds, nanoseconds]: [number, number]): number {
    return (seconds * 1000) + (nanoseconds / 1e+6);
  }
  //#endregion
}
