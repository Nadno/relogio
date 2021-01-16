import progressiveClock from "./clockUp";
import regressiveClock from "./clockDown";

import { formatTimeUnit, secondsToReadableTime } from "./formatTime";
import { changeInputUnit, focusInputUnit, validInputUnit } from "./inputEvents";

import "../public/styles/style.scss";

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
let inProgress = false;

start.addEventListener("click", (e: MouseEvent) => {
  if (inProgress) return;

  const time = getTime();
  const element = document.getElementById("clock-time");

  const renderReadableTime = (UTCTime) => {
    element.classList.add("c-clock--active");
    element.innerHTML = secondsToReadableTime(UTCTime);
  }
  
  clock.setStopAction(() => {
    element.classList.remove("c-clock--active");
  });

  clock.setTickAction(renderReadableTime)

  clock.start("00:00:00", time);
  inProgress = true;
});

stop.addEventListener("click", (e: MouseEvent) => {
  if (!inProgress) return;
  clock.stop();
  inProgress = false;
})
