import { ticker, stopper } from "./clock";
import { Clock } from "./createClock";

import { minutesToSeconds } from "./utils/formatTime";

interface PomodoroClock extends Clock {
  pomodoroState: "pomodoro" | "pause";
  from?: number;
  to?: number;
  setConfirmEvent(startConfirmEvent: (message?: { title: string, description: string; }) => void): void;
  resetClock(): void;
  restart(): void;
  pause(): void;
  tick(): void;
}

const pomodoroClocker = {
  resetClock() {
    this.pomodoroState = "pomodoro";
    this.from = 0;
    this.to = minutesToSeconds(25);
  },

  tick() {
    this.from++;

    if (this.tickAction && this.from > 0) this.tickAction(this.from, this.to);
    if (this.from >= this.to) {
      this.pomodoroState === "pomodoro" ? this.pause() : this.restart();
    }
  },

  setConfirmEvent(startConfirmEvent) {
    this.startConfirmEvent = startConfirmEvent;
  },

  setStartAction(callback) {
    this.startAction = callback;
  },

  start() {
    const oneSecond = 1000;
    if (this.startAction) this.startAction(this.from, this.to);

    this.tickID = setInterval(() => {
      this.tick();
    }, oneSecond);
  },

  pause() {
    this.to = minutesToSeconds(5);
    this.stop();

    const confirmAction = (confirm: boolean) => {
      if (confirm) {
        this.start();
        this.pomodoroState = "pause";
        return;
      }

      this.resetClock();
    };

    this.startConfirmEvent(
      {
        title: "Pomodoro completo",
        description: "Você quer iniciar uma pausa?",
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
        this.pomodoroState = "pomodoro";
        return;
      }

      this.resetClock();
    };

    this.startConfirmEvent(
      {
        title: "Pause completo",
        description: "Você quer iniciar um novo pomodoro?",
      },
      confirmAction
    );
  },

  ...ticker,
  ...stopper,
};

const createPomodoro = (): PomodoroClock => {
  const newPomodoro = Object.create(pomodoroClocker);
  return Object.assign(newPomodoro, {
    pomodoroState: "pomodoro",
    from: 0,
    to: minutesToSeconds(25),
  });
};

export default createPomodoro;
