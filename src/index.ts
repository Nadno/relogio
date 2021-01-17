import { formatTimeUnit } from "./formatTime";
import { changeInputUnit, focusInputUnit, validInputUnit } from "./inputEvents";
import selectClock, { ClockType } from "./startAndStopEvent";

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

const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const select = document.querySelector<HTMLSelectElement>("#select-clock");

let selectedEvents;

const selectClockEvent = () => {
  const value = select.value as ClockType;
  const [startEvent, stopEvent] = selectClock(value, getTime);
  
  startButton.removeEventListener("click", selectedEvents?.startEvent);
  stopButton.removeEventListener("click", selectedEvents?.stopEvent);
  console.log("selecionado: ", value)

  startButton.addEventListener("click", startEvent);
  stopButton.addEventListener("click", stopEvent);

  selectedEvents = { startEvent, stopEvent };
};

select.addEventListener("change", selectClockEvent);
selectClockEvent();
