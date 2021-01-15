import { formatTimeUnit } from "./formatTime";

const setMaxAndMinValue = (MAX_INPUT_VALUE: number, MIN_INPUT_VALUE = 0) => 
  (value: number, input: HTMLInputElement) => {
    if (value < MIN_INPUT_VALUE || value > MAX_INPUT_VALUE) {
      input.value = formatTimeUnit(MAX_INPUT_VALUE);
      return;
    }
    input.value = formatTimeUnit(value);
  };

const NINETY_NINE = 99;
const SIXTY = 59;

const validInput = {
  hours: setMaxAndMinValue(NINETY_NINE),
  minutes: setMaxAndMinValue(SIXTY),
  seconds: setMaxAndMinValue(SIXTY),
};

export default validInput;