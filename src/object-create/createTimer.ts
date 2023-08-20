import { starter, stopper, observer, Emitters, Observables, Clock } from './clock';

export type TimerSubject = {
  from: number;
  to: number;
  current: number;
};

export type TimerTimeHandler = (time: TimerSubject) => void;

export interface TimerEmitters {
  (type: 'tick', time: TimerSubject): void;
  (type: 'stop', data: TimerSubject): void;
  (type: 'start', data: TimerSubject): void;
}

export interface TimerObservables {
  (type: 'stop', handler: TimerTimeHandler): void;
  (type: 'start', handler: TimerTimeHandler): void;
  (type: 'tick', handler: TimerTimeHandler): void;
}

export interface TimerClock extends Clock<TimerEmitters, TimerObservables> {}

const timerClocker = {
  ...observer,
  ...starter,
  ...stopper,

  tick() {
    this.current--;

    this._emit('tick', {
      from: this.from,
      to: this.to,
      current: this.current,
    });

    if (this.current === this.to) this.stop();
  },
};

const createTimer = <
  TClock extends Clock<Emitters, Observables> = Clock<Emitters, Observables>
>(): TClock => Object.create(timerClocker);

export default createTimer;
