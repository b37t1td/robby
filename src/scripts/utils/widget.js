const qPrices = ['100', '80', '60', '30', '10'];

function Widget(options) {
  this.opt = options;
  this.started = false;
  this.onStartCb = this.onStopCb = function() {};
  this.fails = 0;
  this.buys = 0;
}

Widget.prototype.inject = function() {
  // container
  this.container = document.createElement('div');
  this.container.classList.add('robby-app');

  // price radio selectors
  let prices = document.createElement('div');
  prices.classList.add('prices');

  for (let p of qPrices) {
    let radio = document.createElement('input');
    radio.setAttribute('type', 'radio');
    radio.setAttribute('name', 'price');
    radio.setAttribute('data-price', p);

    let label = document.createElement('label');
    label.appendChild(radio);
    label.appendChild(document.createTextNode(p));

    prices.appendChild(label);
    this[`q${p}`] = radio;
  }

  this[`q${this.opt.defaultPrice}`].checked = true;

  this.btn = document.createElement('button');
  this.btnText = document.createTextNode('start');
  this.btn.appendChild(this.btnText);
  this.btn.addEventListener('click', this.btnClick.bind(this));

  this.container.appendChild(prices);
  this.container.appendChild(this.btn);

  let stats = document.createElement('div');
  stats.classList.add('stats');
  this.buy = document.createElement('span');
  this.fail = document.createElement('span');
  this.buy.classList.add('buy');
  this.fail.classList.add('fail');
  this.buy.innerText = '0';
  this.fail.innerText = '0';
  stats.appendChild(document.createTextNode('status: '));
  stats.appendChild(this.buy);
  stats.appendChild(document.createTextNode(' / '));
  stats.appendChild(this.fail);

  this.container.appendChild(stats);
  document.body.appendChild(this.container);
}

Widget.prototype.selectedPrice = function() {
  for (let p of qPrices) {
    if (this[`q${p}`].checked) {
      return p;
    }
  }
}

Widget.prototype.onbuy = function() {
  this.buys++;
  this.buy.innerText = this.buys;
}

Widget.prototype.onfail = function() {
  this.fails++;
  this.fail.innerText = this.fails;
}


Widget.prototype.start = function() {
  let price = this.selectedPrice();
  this.started = true;
  this.btnText.textContent = 'stop';
  this.onStartCb(price);
}

Widget.prototype.stop = function() {
  let price = this.selectedPrice();
  this.started = false;
  this.btnText.textContent = 'start';
  this.onStopCb(price);
}

Widget.prototype.btnClick = function() {
  let price = this.selectedPrice();

  if (this.started) {
    this.stop();
  } else {
    this.start();
  }
}

Widget.prototype.onStart = function(cb) {
  this.onStartCb = cb || function() {};
}

Widget.prototype.onStop = function(cb) {
  this.onStopCb = cb || function() {};
}

export default Widget;
