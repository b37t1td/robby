import Widget from './utils/widget';
import Runner from './utils/runner';
import ext from './utils/ext';

function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}

if (!window.Big) {
  window.addEventListener( 'visibilitychange', evt => evt.stopImmediatePropagation(), true);
  injectScript(ext.extension.getURL('/scripts/contentscript.js'), 'body');
} else {
  let prices = {
    '100':'98235568581687470146620701612724868483225687720398878210090213855',
    '80': '78235568581687470146620701612724868483225687720398878210090213855',
    '60': '59235568581687470146620701612724868483225687720398878210090213855',
    '30': '29235568581687470146620701612724868483225687720398878210090213855',
    '10': '9235568581687470146620701612724868483225687720398878210090213855'
  };

  function petId() {
    return window.location.href.replace(/^.+\/(\d+)$/,'$1');
  }

  let app = new Widget({
    defaultPrice: '60'
  });

  let runner = new Runner({
    onbuy: app.onbuy.bind(app),
    onfail: app.onfail.bind(app),
    onstop: app.stop.bind(app),
    onrace: app.onrace.bind(app)
  });

  app.inject();
  app.onStart(function(price) {
    runner.run(Number(petId()), prices[price]);
  }.bind(this));

  app.onStop(function(price) {
    runner.off();
  }.bind(this));
}
