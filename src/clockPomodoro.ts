import clock from "./clock";

import { minutesToSeconds } from "./formatTime";

interface PomodoroClock {
  pause(): void;
  restart(): void;
  tick(): void;
}

const pomodoroCounter: PomodoroClock = {
  tick() {
    this.from++;
    
    if (this.from >= this.to) {
      this.stop();
    }
  },

  pause() {
    this.to = minutesToSeconds(5);
    this.start();
  },

  restart() {
    this.to = minutesToSeconds(25);
    this.start();
  },
}

const pomodoroClock = () => ({
  from: 0,
  to: minutesToSeconds(25),

  ...clock,
  ...pomodoroCounter,
})

export default pomodoroClock;