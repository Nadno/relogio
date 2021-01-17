import createClock, { Clock } from "./clock";

import { minutesToSeconds } from "./formatTime";

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

const pomodoroCounter = {
  resetClock() {
    this.pomodoroState = "pomodoro";
    this.from = 0;
    this.to = 10;
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
    this.to = 5;
    this.stop();

    await this.confirmAction("Congrats, now do you wanna start a pause?")
      .then(() => {
        this.start();
        this.pomodoroState = "pause";
      })
      .catch(() => this.resetClock);
  },

  async restart() {
    this.to = 10;
    this.stop();
    await this.confirmAction("Congrats, now do you wanna start another pomodoro?")
      .then(() => {
        this.start();
        this.pomodoroState = "pomodoro";
      })
      .catch(() => this.resetClock);
  },
};

const pomodoroClock = (): PomodoroClock => ({
  pomodoroState: "pomodoro",
  from: 0,
  to: 10, // minutesToSeconds(25)

  ...createClock(),
  ...pomodoroCounter,
});

export default pomodoroClock;
