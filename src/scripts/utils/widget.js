const qPrices = ['100', '80', '60', '30', '10'];

function Widget(options) {
  this.opt = options;
  this.started = false;
  this.onStartCb = this.onStopCb = function() {};
  this.fails = 0;
  this.buys = 0;
  this.remote = false;
}

Widget.prototype.inject = function() {
  // container
  this.container = document.createElement('div');
  this.container.classList.add('robby-app');

  this.remoteMode = document.createElement('a');
  this.remoteMode.classList.add('remoteBtn');
  this.remoteMode.innerText = 'Remote off';
  this.remoteMode.setAttribute('href', '#');
  this.remoteMode.addEventListener('click', this.remoteClick.bind(this));

  this.container.appendChild(this.remoteMode);

  this.remoteStats = document.createElement('span');
  this.remoteStats.classList.add('remote-stats');
  this.remoteStats.innerText = '0';

  this.container.appendChild(this.remoteStats);
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
  this.btnText = document.createTextNode('Start now!');
  this.btn.appendChild(this.btnText);
  this.btn.classList.add('greenBtn');
  this.btn.addEventListener('click', this.btnClick.bind(this));

  let shareBtn = document.createElement('a');
  shareBtn.innerText = 'Share';
  shareBtn.classList.add('shareBtn');
  shareBtn.setAttribute('href', '#');
  shareBtn.addEventListener('click', this.shareClick.bind(this));


  this.container.appendChild(prices);
  this.container.appendChild(this.btn);
  this.container.appendChild(shareBtn);

  let stats = document.createElement('div');
  stats.classList.add('stats');
  this.buy = document.createElement('span');
  this.fail = document.createElement('span');
  this.racer = document.createElement('span');
  this.buy.classList.add('buy');
  this.fail.classList.add('fail');
  this.racer.classList.add('racer');
  this.buy.innerText = '0';
  this.fail.innerText = '0';
  this.racer.innerText = '0';
  stats.appendChild(document.createTextNode('status: '));
  stats.appendChild(this.buy);
  stats.appendChild(document.createTextNode(' / '));
  stats.appendChild(this.fail);
  stats.appendChild(document.createTextNode(' / '));
  stats.appendChild(this.racer);

  this.container.appendChild(stats);
  //document.body.appendChild(this.container);
  this.insertContainer();

  window.addEventListener('popstate', () => {
    this.insertContainer();
  });
}

Widget.prototype.insertContainer = function() {
  let count = 0;
  let awaitVal = setInterval(() => {
    if (!window.location.href.match(/^.*\/\d+$/)) {
      return;
    }
    let div = document.querySelector('#pet-page .id-container-pet-info');
    if (div) {
      div.appendChild(this.container);
      clearInterval(awaitVal);
    }

    if (count  >= 10) {
      clearInterval(awaitVal);
    }

    count++;
  }, 1000);
}

Widget.prototype.lockProps = function(val) {
  for (let p of qPrices) {
    this[`q${p}`].disabled = val;
  }
}

Widget.prototype.selectedPrice = function() {
  for (let p of qPrices) {
    if (this[`q${p}`].checked) {
      return p;
    }
  }
}

Widget.prototype.onrace = function(racers) {
  this.racer.innerText = racers;
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
  this.btnText.textContent = 'Stop';
  this.onStartCb(price);
  this.buys = -1;
  this.fails = -1;
  this.onbuy();
  this.onfail();
  this.onrace(0);
  this.lockProps(true);
}

Widget.prototype.stop = function() {
  let price = this.selectedPrice();
  this.started = false;
  this.btnText.textContent = 'Start now!';
  this.onStopCb(price);
  this.lockProps(false);
  this.onrace(0);
}

Widget.prototype.btnClick = function() {
  let price = this.selectedPrice();

  if (this.started) {
    this.stop();
  } else {
    this.start();
  }
}

Widget.prototype.shareClick = function(e) {
  e.preventDefault();
  let price = this.selectedPrice();
  this.opt.onshare(price);

  return false;
}

Widget.prototype.remoteClick = function(e) {
  e.preventDefault();

  if (this.remote) {
    this.remote = false;
    this.remoteMode.innerText = 'Remote off';
  } else {
    this.remote = true;
    this.remoteMode.innerText = 'Remote on';
  }

  this.opt.onremote(this.remote);

  return false;
}

Widget.prototype.onStart = function(cb) {
  this.onStartCb = cb || function() {};
}

Widget.prototype.onStop = function(cb) {
  this.onStopCb = cb || function() {};
}

export default Widget;
