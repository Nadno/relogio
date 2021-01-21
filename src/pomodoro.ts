import { Clock, clock } from "./clock";

import { minutesToSeconds } from "./utils/formatTime";

interface PomodoroClock extends Clock {
  pomodoroState: "pomodoro" | "pause";
  from?: number;
  to?: number;

  setConfirmAction(confirm: (message?: string) => Promise<boolean>): void;
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

  setConfirmAction(confirm) {
    this.confirmAction = confirm;
  },

  async pause() {
    this.to = minutesToSeconds(5);
    this.stop();

    await this.confirmAction("Pomodoro complete, do you wanna start a pause?")
      .then(() => {
        this.start();
        this.pomodoroState = "pause";
      })
      .catch(() => this.resetClock);
  },

  async restart() {
    this.to = minutesToSeconds(25);
    this.stop();
    await this.confirmAction("Pomodoro time, do you wanna start it?")
      .then(() => {
        this.start();
        this.pomodoroState = "pomodoro";
      })
      .catch(() => this.resetClock);
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
