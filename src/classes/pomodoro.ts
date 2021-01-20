import Clock from "./clock";

import { minutesToSeconds } from "../utils/formatTime";

interface FunctionConfirmAction {
  (message?: string): Promise<boolean>;
}

interface Pomodoro extends Clock {
  confirmAction: FunctionConfirmAction | undefined;
  setConfirmAction(confirm: FunctionConfirmAction): void;
  resetClock(): void;
  restart(): void;
  pause(): void;
  tick(): void;
}

class PomodoroClock extends Clock implements Pomodoro {
  #pomodoroState: "pomodoro" | "pause" = "pomodoro";
  confirmAction;

  to = minutesToSeconds(25);

  resetClock() {
    this.#pomodoroState = "pomodoro";
    this.from = 0;
    this.to = minutesToSeconds(25);
  }

  tick() {
    this.from++;
    if (this.tickAction && this.from > 0) this.tickAction(this.from, this.to);
    if (this.from >= this.to) {
      this.#pomodoroState === "pomodoro" ? this.pause() : this.restart();
    }
  }

  setConfirmAction(confirm) {
    this.confirmAction = confirm;
  }

  async pause() {
    this.to = minutesToSeconds(5);
    this.stop();

    await this.confirmAction("Pomodoro complete, do you wanna start a pause?")
      .then(() => {
        this.start();
        this.#pomodoroState = "pause";
      })
      .catch(() => this.resetClock);
  }

  async restart() {
    this.to = minutesToSeconds(25);
    this.stop();
    await this.confirmAction("Pomodoro time, do you wanna start it?")
      .then(() => {
        this.start();
        this.#pomodoroState = "pomodoro";
      })
      .catch(() => this.resetClock);
  }
};

export default PomodoroClock;
