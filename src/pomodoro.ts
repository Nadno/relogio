import { Clock, clock } from "./clock";

import { minutesToSeconds } from "./utils/formatTime";

interface PomodoroClock extends Clock {
  pomodoroState: "pomodoro" | "pause";
  from?: number;
  to?: number;
  setConfirmEvent(startConfirmEvent: (message?: string) => void): void;
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
      "Pomodoro complete, do you wanna start a pause?",
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
      "Pomodoro time, do you wanna start it?",
      confirmAction
    );
  },
};

const createPomodoro = (): PomodoroClock => {
  const newPomodoro = Object.create(clock);
  return Object.assign(newPomodoro, {
    pomodoroState: "pomodoro",
    from: 0,
    to: minutesToSeconds(25),

    ...pomodoroClocker,
  });
};

export default createPomodoro;
