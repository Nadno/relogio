import progressiveClock from "./clockUp";
import regressiveClock from "./clockDown";

import "../public/styles/style.scss";
import validInput from "./validTimeInput";

const time = Array.from(document.querySelectorAll<HTMLInputElement>(".time"));

const timeComponent = document.querySelector<HTMLDivElement>("#time");

const inputStep = {
  ArrowLeft: (element: HTMLElement) => {
    const previousSibling = element.previousElementSibling as HTMLInputElement;
    if (previousSibling) previousSibling.select();
  },
  ArrowRight: (element: HTMLElement) => {
    const nextSibling = element.nextElementSibling as HTMLInputElement;
    if (nextSibling) nextSibling.select();
  },
}

time.forEach((unitInput) => {
  unitInput.oninput = () => {
    const nextUnitInput = unitInput.nextElementSibling as HTMLInputElement;

    if (isNaN(Number(unitInput.value))) {
      unitInput.value = "";
      return;
    }

    if (!nextUnitInput) {
      validInput.seconds(Number(unitInput.value), unitInput);
      return;
    }
    
    if (unitInput.value.length === 2) {
      nextUnitInput.select();
      validInput[unitInput.id](Number(unitInput.value), unitInput);
    }
  };

  unitInput.addEventListener("focus", () => {
    unitInput.select();
  });

  


  unitInput.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key.includes("Arrow")) {
      e.preventDefault();
      if (inputStep[e.key]) inputStep[e.key](e.target);
    }
  });
});
