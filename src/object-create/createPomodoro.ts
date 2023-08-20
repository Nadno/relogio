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
}

export interface PomodoroObservables {
  (type: 'stop', handler: PomodoroTimeHandler): void;
  (type: 'start', handler: PomodoroTimeHandler): void;
  (type: 'tick', handler: PomodoroTimeHandler): void;
}

export interface PomodoroClock extends Clock<PomodoroEmitters, PomodoroObservables> {
  pomodoroState: 'pomodoro' | 'pause';
  from?: number;
  to?: number;
  setConfirmEvent(
    startConfirmEvent: (message?: {
      title: string;
      description: string;
    }) => void
  ): void;
  resetClock(): void;
  restart(): void;
  pause(): void;
  start(): void;
  tick(): void;
}

const pomodoroClocker: PomodoroClock = {
  ...observer,
  ...stopper,

  pomodoroState: 'pomodoro',

  resetClock() {
    this.pomodoroState = 'pomodoro';
    this.current = this.from;
    this.to = minutesToSeconds(25);
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
      this.pomodoroState === 'pomodoro' ? this.pause() : this.restart();
    }
  },

  setConfirmEvent(startConfirmEvent) {
    this.startConfirmEvent = startConfirmEvent;
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

  pause() {
    this.to = minutesToSeconds(5);
    this.stop();

    const confirmAction = (confirm: boolean) => {
      if (confirm) {
        this.start();
        this.pomodoroState = 'pause';
        return;
      }

      this.resetClock();
    };

    this.startConfirmEvent(
      {
        title: 'Pomodoro completo',
        description: 'Você quer iniciar uma pausa?',
      },
      confirmAction
    );
  },

  restart() {
    this.to = minutesToSeconds(25);
    this.stop();

    const confirmAction = (confirm: boolean) => {
      if (confirm) {
        this.start();
        this.pomodoroState = 'pomodoro';
        return;
      }

      this.resetClock();
    };

    this.startConfirmEvent(
      {
        title: 'Pause completo',
        description: 'Você quer iniciar um novo pomodoro?',
      },
      confirmAction
    );
  },
};

const createPomodoro = <
  TClock extends Clock<Emitters, Observables> = Clock<Emitters, Observables>
>(): TClock => {
  const newPomodoro = Object.create(pomodoroClocker);
  return Object.assign(newPomodoro, {
    pomodoroState: 'pomodoro',
    from: 0,
    current: 0,
    to: minutesToSeconds(25),
  });
};

export default createPomodoro;
