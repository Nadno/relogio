import defer from './defer';

interface Alert {
  alert: string;
  toElement: string;
}

const alerter = {
  open: true,
  alerts: [] as Alert[],
  alert() {
    if (!this.open) return;
    this.open = false;

    const pendentAlert = this.alerts.shift();
    if (!pendentAlert) return;

    this.showAlert(pendentAlert);

    setTimeout(() => {
      this.hideAlert(pendentAlert);

      if (!this.alerts.length) {
        this.open = true;
      } else {
        defer(() => this.alert());
      }
    }, 1500);
  },
  addAlert(alert: Alert) {
    this.alerts.push(alert);
  },
  showAlert(pendentAlert: Alert) {
    const { alert: $alert } = this._getElements(pendentAlert);

    $alert.innerText = pendentAlert.alert;
    $alert.setAttribute('role', 'region');
    $alert.setAttribute('aria-live', 'polite');
    $alert.dataset.state = 'open';
  },
  hideAlert(alert: Alert) {
    const { alert: $alert } = this._getElements(alert);

    $alert.innerText = '';
    $alert.dataset.state = 'closed';
  },
  _getElements(alert: Alert) {
    const { toElement } = alert;
    const alertEl = document.querySelector(toElement);

    return { alert: alertEl };
  },
};

export const alertOnAlertSpan = (message: string) => {
  alerter.addAlert({
    alert: message,
    toElement: 'span#alerts',
  });

  alerter.alert();
};
