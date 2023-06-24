import { interval } from 'src/utils/interval';

type ClockCallback = (ms: number) => void;

export class Clock {
  private abortController = new AbortController();
  private callbacks: ClockCallback[] = [];
  private ms = 0;

  constructor() {
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  getMs() {
    return this.ms;
  }

  start(startingMs = 0) {
    this.abortController = new AbortController();
    interval(10, this.abortController.signal, (ms) => {
      this.ms = ms + startingMs;
      this.callbacks.forEach((callback) => callback(this.ms));
    });
  }

  stop() {
    this.abortController.abort();
  }

  subscribe(callback: ClockCallback) {
    this.callbacks.push(callback);
    const unsubscribe = () => {
      const index = this.callbacks.indexOf(callback);
      if (index !== -1) this.callbacks.splice(index, 1);
    };
    return unsubscribe;
  }
}
