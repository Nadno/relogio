import Clock from "./clock";

import { minutesToSeconds } from "../utils/formatTime";

function Pomodoro() {
  Clock.call(this);
  this.pomodoroState = "pomodoro";
  this.confirmAction;

  this.to = minutesToSeconds(25);
};

Pomodoro.prototype = Object.create(Clock.prototype);

Pomodoro.prototype.resetClock = function resetClock() { 
  this.pomodoroState = "pomodoro";
  this.from = 0;
  this.to = minutesToSeconds(25);
}

Pomodoro.prototype.tick = function tick() {
  this.from++;
  if (this.tickAction && this.from > 0) this.tickAction(this.from, this.to);
  if (this.from >= this.to) {
    this.pomodoroState === "pomodoro" ? this.pause() : this.restart();
  }
}

Pomodoro.prototype.setConfirmAction = function setConfirmAction(confirm) {
  this.confirmAction = confirm;
}

Pomodoro.prototype.pause = async function pause() {
  this.to = minutesToSeconds(5);
  this.stop();

  await this.confirmAction("Pomodoro complete, do you wanna start a pause?")
    .then(() => {
      this.start();
      this.pomodoroState = "pause";
    })
    .catch(() => this.resetClock);
}

Pomodoro.prototype.restart = async function restart() {
  this.to = minutesToSeconds(25);
  this.stop();
  await this.confirmAction("Pomodoro time, do you wanna start it?")
    .then(() => {
      this.start();
      this.pomodoroState = "pomodoro";
    })
    .catch(() => this.resetClock);
}

export default Pomodoro;
