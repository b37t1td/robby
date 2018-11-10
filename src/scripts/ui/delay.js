class DelayWidget {
  constructor() {
    this.el = document.createElement('div');
    this.el.classList.add('delay-widget');

    this.createControl();
  }

  createControl() {
    this.input = document.createElement('input');
    this.count = document.createElement('span');

    this.input.setAttribute('type', 'range');
    this.input.setAttribute('step', '5');
    this.input.setAttribute('min', 0);
    this.input.setAttribute('max', 900);

    this.input.addEventListener('input', this.changeDelay.bind(this), false);
    this.update();

    this.el.appendChild(this.input);
    this.el.appendChild(this.count);
  }

  updateCount() {
    this.count.innerText = window.robby.delay;
  }

  update() {
    setTimeout(() => {
      this.input.setAttribute('value', window.robby.delay);
      this.input.value = window.robby.delay;
      this.updateCount();
    }, 300);
  }

  changeDelay(e) {
    let delay = e.target.value;
    window.robby.delay = delay;
    window.robby.remote.send({ type: 'sync-delay', delay: delay });
    this.updateCount();
  }
}

export default DelayWidget;
