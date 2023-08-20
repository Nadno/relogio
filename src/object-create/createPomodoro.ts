import { stopper, observer, Clock, Emitters, Observables } from './clock';

import { minutesToSeconds } from '../utils/formatTime';

export type PomodoroSubject = {
  from: number;
  to: number;
  current: number;
};

export type PomodoroTimeHandler = (time: PomodoroSubject) => void;

export interface PomodoroEmitters {
  (type: 'tick', time: PomodoroSubject): void;
  (type: 'stop', data: PomodoroSubject): void;
  (type: 'start', data: PomodoroSubject): void;
  (type: 'focus', data?: null): void;
  (type: 'pause', data?: null): void;
}

export interface PomodoroObservables {
  (type: 'stop', handler: PomodoroTimeHandler): void;
  (type: 'start', handler: PomodoroTimeHandler): void;
  (type: 'tick', handler: PomodoroTimeHandler): void;
  (type: 'focus', handler: Function): void;
  (type: 'pause', handler: Function): void;
}

export interface PomodoroClock
  extends Clock<PomodoroEmitters, PomodoroObservables> {
  pomodoroState: 'focus' | 'pause';
  from?: number;
  to?: number;

  resetClock(): void;
  focusMode(): void;
  pauseMode(): void;
  start(): void;
  tick(): void;
}

const pomodoroClocker: PomodoroClock = {
  ...observer,
  ...stopper,

  pomodoroState: 'focus',

  resetClock() {
    this.current = this.from;
    this.to = minutesToSeconds(this.pomodoroState === 'focus' ? 25 : 5);
  },

  tick() {
    this.current++;

    if (this.current > 0) {
      this._emit('tick', {
        from: this.from,
        to: this.to,
        current: this.current,
      });
    }

    if (this.current >= this.to) {
      this.stop();
      this.pomodoroState === 'focus' ? this.pauseMode() : this.focusMode();
    }
  },

  start() {
    const oneSecond = 1000;

    this._emit('start', {
      from: this.from,
      to: this.to,
      current: this.current,
    });

    this.tickID = setInterval(() => this.tick(), oneSecond);
  },

  pauseMode() {
    this.pomodoroState = 'pause';
    this.resetClock();
    this._emit('pause');
  },

  focusMode() {
    this.pomodoroState = 'focus';
    this.resetClock();
    this._emit('focus');
  },
};

const createPomodoro = <
  TClock extends Clock<Emitters, Observables> = Clock<Emitters, Observables>
>(): TClock => {
  const newPomodoro = Object.create(pomodoroClocker);
  return Object.assign(newPomodoro, {
    pomodoroState: 'focus',
    from: 0,
    current: 0,
    to: minutesToSeconds(25),
  });
};

export default createPomodoro;
