const track = document.querySelector("audio");

const confirmPopUp = (message?: string): Promise<boolean> => {
  const popUp = document.createElement("div");
  const buttonsContainer =document.createElement("div");
  const confirmButton = document.createElement("button");
  const rejectButton = document.createElement("button");

  popUp.classList.add("c-pop-up");

  if (message) {
    popUp.insertAdjacentHTML("afterbegin", `
      <span class="c-pop-up__message">${message}</span>
    `);
  }
  
  confirmButton.innerText = "YES";
  rejectButton.innerText = "NO";


  confirmButton.classList.add("c-button", "c-button--confirm");
  rejectButton.classList.add("c-button", "c-button--reject");

  buttonsContainer.insertAdjacentElement("beforeend", confirmButton);
  buttonsContainer.insertAdjacentElement("beforeend", rejectButton);
  popUp.insertAdjacentElement("beforeend", buttonsContainer);
  
  document.body.insertAdjacentElement("beforeend", popUp);

  
  track.play();

  return new Promise((resolve, reject) => {
    function resolveEvent() {
      resolve(true);
      confirmButton.removeEventListener("click", resolveEvent);
      confirmButton.removeEventListener("click", rejectEvent);
      popUp.remove();
    }

    function rejectEvent() {
      reject(false);
      confirmButton.removeEventListener("click", rejectEvent);
      confirmButton.removeEventListener("click", resolveEvent);
      popUp.remove();
    }

    confirmButton.addEventListener("click", resolveEvent);
    rejectButton.addEventListener("click", rejectEvent);
  });
};

export default confirmPopUp;
