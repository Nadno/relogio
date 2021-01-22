import selectClock, { ClockType } from "./createClockEvents";

import ptBrClocks from "./utils/ptBrClocks";
import { formatTimeUnit } from "./utils/formatTime";
import { alertOnAlertSpan } from "./utils/accessibilityAlert";
import { changeInputUnit, focusInputUnit, validInputUnit } from "./inputEvents";

import "../public/styles/style.scss";

const inputsTimeUnits = Array.from(
  document.querySelectorAll<HTMLInputElement>(".time")
);
const getTime = () =>
  inputsTimeUnits
    .map(({ value }) => {
      if (!value.trim() || isNaN(Number(value))) return "00";
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

  
  selectedEvents?.stopEvent();
  
  startButton.removeEventListener("click", selectedEvents?.startEvent);
  stopButton.removeEventListener("click", selectedEvents?.stopEvent);
  
  startButton.addEventListener("click", startEvent);
  stopButton.addEventListener("click", stopEvent);
  
  selectedEvents = { startEvent, stopEvent };

  alertOnAlertSpan(`O ${ptBrClocks[value]} foi selecionado`);
};

select.addEventListener("change", selectClockEvent);
selectClockEvent();
