import validInput from "./validTimeInput";

const inputStep = {
  ArrowLeft: (element: HTMLElement, e: KeyboardEvent) => {
    e.preventDefault();
    const previousSibling = element.previousElementSibling as HTMLInputElement;
    if (previousSibling) previousSibling.select();
  },
  ArrowRight: (element: HTMLElement, e: KeyboardEvent) => {
    e.preventDefault();
    const nextSibling = element.nextElementSibling as HTMLInputElement;
    if (nextSibling) nextSibling.select();
  },
};

export const changeInputUnit = (e: KeyboardEvent) => {
  if (inputStep[e.key]) inputStep[e.key](e.target, e);
}

export const focusInputUnit = (e: FocusEvent) => {
  (e.target as HTMLInputElement).select();
}

export const validInputUnit = (e: InputEvent) => {
  const inputUnit = e.target as HTMLInputElement;
  const nextInputUnit = inputUnit.nextElementSibling as HTMLInputElement;

  if (isNaN(Number(inputUnit.value))) {
    inputUnit.value = "";
    return;
  }

  if (!nextInputUnit) {
    validInput.seconds(Number(inputUnit.value), inputUnit);
    return;
  }

  if (inputUnit.value.length === 2) {
    nextInputUnit.select();
    validInput[inputUnit.id](Number(inputUnit.value), inputUnit);
  }
}