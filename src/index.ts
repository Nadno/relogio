import { formatTimeUnit } from "./formatTime";
import { startClock, stopClock } from "./startAndStopEvent";
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

start.addEventListener("click", startClock(getTime));
stop.addEventListener("click", stopClock(getTime))
