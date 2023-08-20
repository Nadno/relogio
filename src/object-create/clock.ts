import { readableTimeToSeconds } from '../utils/formatTime';

export type Emitters = {
  (type: string, ...args: any[]): void;
};

export type Observables = {
  (type: string, handler: Function): void;
};

export type Observer<TEmitters extends Emitters, TObservables> = {
  _emit: TEmitters;
  on: TObservables;
  off: TObservables;
};

export type ClockSubject = {
  from: number;
  to: number;
  current: number;
};

export type ClockTimeHandler = (time: ClockSubject) => void;

export interface ClockEmitters {
  (type: 'stop', time?: ClockSubject): void;
  (type: 'start', time?: ClockSubject): void;
  (type: 'tick', time: ClockSubject): void;
}

export interface ClockObservables {
  (type: 'stop', handler: ClockTimeHandler): void;
  (type: 'start', handler: ClockTimeHandler): void;
  (type: 'tick', handler: ClockTimeHandler): void;
}

export interface Clock<
  TEmitters extends Emitters,
  TObservables extends Observables
> extends Observer<TEmitters, TObservables> {
  start(from?: string, to?: string): void;
  stop(): void;
  tick(): void;
}

export const observer = {
  _observers: [],

  _emit(type: string, data: any) {
    this._observers
      .filter(observer => observer.type === type)
      .forEach(observer => observer.handler(data));
  },

  on(type: string, handler: Function) {
    this._observers.push({ type, handler });
  },

  off(type: string, handler: Function) {
    this._observers = this._observers.filter(
      observer => !(observer.type === type && observer.handler === handler)
    );
  },
};

export const starter = {
  start(from = '', to = '') {
    const oneSecond = 1000;

    if (from) {
      this.from = readableTimeToSeconds(from);
      this.current = this.from;
    }

    if (to) this.to = readableTimeToSeconds(to);

    this._emit('start', {
      from: this.from,
      to: this.to,
      current: this.current,
    });

    this.tickID = setInterval(() => this.tick(), oneSecond);
  },
};

export const stopper = {
  stop() {
    clearInterval(this.tickID);
    this.current = 0;

    this._emit('stop');
  },
};
