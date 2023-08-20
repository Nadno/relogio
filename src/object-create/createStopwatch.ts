import { starter, stopper, Clock, Emitters, Observables, observer } from './clock';

export type StopwatchSubject = {
  from: number;
  to: number;
  current: number;
};

export interface StopwatchEmitters {
  (type: 'tick', time: StopwatchSubject): void;
  (type: 'stop', data: StopwatchSubject): void;
  (type: 'start', data: StopwatchSubject): void;
}

export type StopwatchTimeHandler = (time: StopwatchSubject) => void;

export interface StopwatchObservables {
  (type: 'stop', handler: StopwatchTimeHandler): void;
  (type: 'start', handler: StopwatchTimeHandler): void;
  (type: 'tick', handler: StopwatchTimeHandler): void;
}

export interface StopwatchClock
  extends Clock<StopwatchEmitters, StopwatchObservables> {}

const stopwatchClocker = {
  ...observer,
  ...starter,
  ...stopper,

  tick() {
    this.current++;

    if (this.current > 0) {
      this._emit('tick', {
        from: this.from,
        to: this.to,
        current: this.current,
      });
    }

    if (this.current >= this.to) this.stop();
  },
};

const createStopwatch = <
  TClock extends Clock<Emitters, Observables> = Clock<Emitters, Observables>
>(): TClock => Object.create(stopwatchClocker);

export default createStopwatch;
