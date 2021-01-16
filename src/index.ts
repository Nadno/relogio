import progressiveClock from "./clockUp";

import { formatTimeUnit } from "./formatTime";
import { changeInputUnit, focusInputUnit, validInputUnit } from "./inputEvents";

import "../public/styles/style.scss";
import createRenderTime from "./renderReadableTime";

const inputsTimeUnits = Array.from(
  document.querySelectorAll<HTMLInputElement>(".time")
);
const getTime = () =>
  inputsTimeUnits
    .map(({ value }) => {
      if (isNaN(Number(value))) return "00";
      return formatTimeUnit(value);
    })
    .join(":");

inputsTimeUnits.forEach((unitInput) => {
  unitInput.addEventListener("input", validInputUnit);
  unitInput.addEventListener("focus", focusInputUnit);
  unitInput.addEventListener("keydown", changeInputUnit);
});

const start = document.getElementById("start");
const stop = document.getElementById("stop");
const clock = progressiveClock();

const getElementClockUnit = (id: string) => Array.from(document.getElementById(id).querySelectorAll("span")).slice(-2);

const render = createRenderTime({
  hours: getElementClockUnit("clock-hours"),
  minutes: getElementClockUnit("clock-minutes"),
  seconds: getElementClockUnit("clock-seconds"),
});

let inProgress = false;
console.dir(clock);

start.addEventListener("click", (e: MouseEvent) => {
  if (inProgress) return;

  const time = getTime();
  const element = document.querySelector(".c-clock");

  clock.setStartAction((UTCTime) => {
    render.renderReadableTime(UTCTime);
    element.classList.add("c-clock--active");
    inProgress = true;
  });
  
  clock.setStopAction(() => {
    render.resetRenderCurrentTime();
    element.classList.remove("c-clock--active");
    inProgress = false;
  });

  clock.setTickAction(render.renderReadableTime)

  element.classList.add("c-clock--active");
  clock.start("00:00:55", time);
});

stop.addEventListener("click", (e: MouseEvent) => {
  if (!inProgress) return;
  clock.stop();
})
