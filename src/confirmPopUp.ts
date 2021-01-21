const track = document.querySelector("audio");

interface ConfirmEvent {
  confirm: boolean | undefined;
  confirmAction: Function;
}

const confirmPopUp = (message?: string, confirmAction?: Function): void => {
  const popUp = document.createElement("div");
  const buttonsContainer = document.createElement("div");
  const confirmButton = document.createElement("button");
  const declineButton = document.createElement("button");

  popUp.classList.add("c-pop-up");

  if (message) {
    popUp.insertAdjacentHTML(
      "afterbegin",
      `<span class="c-pop-up__message">${message}</span>`
    );
  }

  confirmButton.innerText = "YES";
  declineButton.innerText = "NO";

  confirmButton.classList.add("c-button", "c-button--confirm");
  declineButton.classList.add("c-button", "c-button--reject");

  buttonsContainer.insertAdjacentElement("beforeend", confirmButton);
  buttonsContainer.insertAdjacentElement("beforeend", declineButton);

  popUp.insertAdjacentElement("beforeend", buttonsContainer);

  const handler: ProxyHandler<ConfirmEvent> = {
    set: (currentContext, key, newValue) => {
      if (typeof newValue === "boolean") {
        currentContext.confirmAction(newValue);
      }

      currentContext[key] = newValue;
      return true;
    },
  };

  const confirmEvent = new Proxy(
    {
      confirm: undefined,
      confirmAction,
    },
    handler
  );

  function confirm() {
    confirmEvent.confirm = true;
    confirmButton.removeEventListener("click", confirm);
    declineButton.removeEventListener("click", decline);
    popUp.remove();
  }

  function decline() {
    confirmEvent.confirm = false;
    confirmButton.removeEventListener("click", confirm);
    declineButton.removeEventListener("click", decline);
    popUp.remove();
  }

  confirmButton.addEventListener("click", confirm);
  declineButton.addEventListener("click", decline);

  document.body.insertAdjacentElement("beforeend", popUp);

  track.play();
};

export default confirmPopUp;
