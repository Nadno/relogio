const track = document.querySelector("audio");
interface ConfirmEvent {
  confirm: boolean | undefined;
  confirmAction: Function;
}

const POP_CONFIRM = "SIM";
const POP_DECLINE = "NÃO";

const confirmPopUp = (message?: { title: string, description: string }, confirmAction?: Function): void => {
  const popUp = document.createElement("div");
  const buttonsContainer = document.createElement("div");
  const confirmButton = document.createElement("button");
  const declineButton = document.createElement("button");

  popUp.classList.add("c-pop-up");
  popUp.setAttribute("role", "alertdialog")
  popUp.setAttribute("aria-labelledby", "pop-up-title")
  popUp.setAttribute("aria-describedby", "pop-up-description")
  popUp.setAttribute("tabindex", '0');

  if (message.title && message.description) {
    popUp.insertAdjacentHTML(
      "afterbegin",
      `
      <span id="pop-up-title">${message.title}</span>
      <span class="c-pop-up__message" id="pop-up-description">${message.description}</span>
      `
    );
  }

  confirmButton.innerText = POP_CONFIRM;
  declineButton.innerText = POP_DECLINE;

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
    document.querySelector<HTMLSelectElement>("#start").focus();
  }

  function decline() {
    confirmEvent.confirm = false;
    confirmButton.removeEventListener("click", confirm);
    declineButton.removeEventListener("click", decline);
    popUp.remove();
    document.querySelector<HTMLButtonElement>("#start").focus();
  }

  confirmButton.addEventListener("click", confirm);
  declineButton.addEventListener("click", decline);

  document.body.insertAdjacentElement("beforeend", popUp);

  track.play();
  popUp.focus();
};

export default confirmPopUp;
