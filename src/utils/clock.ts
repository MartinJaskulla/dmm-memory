import { interval } from './interval';

export type ClockCallback = (ms: number) => void;

export class Clock {
  private abortController = new AbortController();
  private callbacks: ClockCallback[] = [];

  private _ms = 0;
  public get ms() {
    return this._ms;
  }
  private set ms(ms: number) {
    this._ms = ms;
    this.callbacks.forEach((callback) => callback(ms));
  }

  constructor() {
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  start(startingMs = 0) {
    this.abortController = new AbortController();
    interval(10, this.abortController.signal, (ms) => (this.ms = ms + startingMs));
  }

  stop() {
    this.abortController.abort();
    // TODO Maybe subscribers pass two functions? callback and cleanup. We call cleanups here?
    // TODO Should I call each callback with 0 on stop?
  }

  subscribe(callback: ClockCallback) {
    callback(this.ms); // TODO Maybe calling immediately is a problem because of React double rendering?
    this.callbacks.push(callback);
    const unsubscribe = () => {
      console.log('unsubscribe', callback);
      this.callbacks.splice(this.callbacks.indexOf(callback), 1);
    };
    return unsubscribe;
  }
}
