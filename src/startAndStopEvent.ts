import progressiveClock from "./clockUp";
import createRenderTime from "./renderReadableTime";

const clock = progressiveClock();

const getElementClockUnit = (id: string) => Array.from(document.getElementById(id).querySelectorAll("span")).slice(-2);

const render = createRenderTime({
  hours: getElementClockUnit("clock-hours"),
  minutes: getElementClockUnit("clock-minutes"),
  seconds: getElementClockUnit("clock-seconds"),
}, document.getElementById("progress-bar"));

let inProgress = false;

const element = document.querySelector(".c-clock");

clock.setStartAction((UTCTime) => {
  render.resetRenderedTime();
  render.renderReadableTime(UTCTime);
  element.classList.add("c-clock--active");
  inProgress = true;
});

clock.setTickAction(render.renderReadableTime)

clock.setStopAction(() => {
  element.classList.remove("c-clock--active");
  inProgress = false;
});

export const startClock = (getTime: () => string) => 
  () => {
    if (inProgress) return;
    clock.start("00:00:00", getTime());
  }

export const stopClock = (getTime: () => string) => 
  () => {
    if (!inProgress) return;
    clock.stop();
  };