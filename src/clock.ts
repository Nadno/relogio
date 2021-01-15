import { readableTimeToSeconds } from "./formatTime";

const clock = {
  start(from: string = "", to: string = "") {
    const oneSecond = 1000;

    if (from) this.from = readableTimeToSeconds(from);
    if (to) this.to = readableTimeToSeconds(to);

    this.tickID = setInterval(() => {
      this.tick();
    }, oneSecond);
  },

  stop() {
    clearInterval(this.tickID);
    this.from = 0;
  },
};


export default clock;
