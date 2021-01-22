interface Alert {
  alert: string;
  describedByElementId: string;
  toElement: string;
}

interface OpenToAlertProxy {
  openToAlert: boolean;
  pendents: Array<Alert>;
  alertUser: Function;
}

const handler: ProxyHandler<OpenToAlertProxy> = {
  set(currentContext, key, newValue) {
    if (
        key !== "openToAlert" ||
        typeof newValue !== "boolean"
      ) return true;

    currentContext[key] = newValue;  
    return true;
  },
};

const alerts = new Proxy(
  {
    openToAlert: true,
    pendents: [],
    alertUser() {
      const { alert, toElement, describedByElementId } = this.pendents[0];
      const alertEl = document.querySelector(toElement);
      const describe = document.getElementById(describedByElementId);

      describe.innerText = alert;
      alertEl.setAttribute("role", "alert");
      alertEl.setAttribute("aria-describedby", describedByElementId);

      this.openToAlert = false;

      setTimeout(() => {
        this.pendents.shift();
        describe.innerText = "";
        alertEl.removeAttribute("role", "alert");
        alertEl.removeAttribute("aria-describedby", describedByElementId);

        if (!this.pendents.length) {
          this.openToAlert = true;
        } else {
          this.alertUser();
        }
      }, 1000);

      alertEl.setAttribute("role", "alert");
    },
  },
  handler
);

const addAlert = (alert: Alert) => {
  alerts.pendents.push(alert);
  if (alerts.openToAlert) {
    alerts.alertUser();
  }
};

export const alertOnAlertSpan = (message: string) =>
  addAlert({
    alert: message,
    toElement: "span#alerts",
    describedByElementId: "alerts",
  });

export default addAlert;