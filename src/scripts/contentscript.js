import Widget from './utils/widget';
import Runner from './utils/runner';
import Remote from './utils/remote';
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
    '140': '138235568581687470146620701612724868483225687720398878210090213855',
    '100':'98235568581687470146620701612724868483225687720398878210090213855',
    '60': '59235568581687470146620701612724868483225687720398878210090213855',
    '30': '29235568581687470146620701612724868483225687720398878210090213855',
    '10': '9235568581687470146620701612724868483225687720398878210090213855'
  };

  function petId() {
    return window.location.href.replace(/^.+\/(\d+)$/,'$1');
  }

  let app;
  let isRemote = false;
  let poll = [];

  let remote = new Remote('wss://app-yexpwnmodw.now.sh', function(data) {
    if (!isRemote) {
      return;
    }

    if (poll.length >= 3) {
      return;
    }

    for (let p of poll) {
      if (p.pet.id === data.id) {
        console.log('already exists ', data.id);
        return;
      }
    }

    let runner = new Runner({
      onbuy: function() {},
      onfail: function() {},
      onstop: function(id) {
        for (let idx = 0; idx < poll.length; idx++) {
          if (poll[idx].pet.id === id) {
            poll.splice(idx, 1);
            break;
          }
        }
        app.remoteStats.innerText = poll.length;
      },
      onrace: function() {},
    });

    poll.push({
      runner: runner,
      pet: data
    });

    runner.run(data.id, prices[data.price]);

    app.remoteStats.innerText = poll.length;
  });

  app = new Widget({
    defaultPrice: '60',
    onshare: function(price) {
      remote.send({ type: 'share',  id: Number(petId()), price: price });
    },
    onremote: function(trigger) {
      isRemote = trigger;
    }
  });

  let runner = new Runner({
    onbuy: app.onbuy.bind(app),
    onfail: app.onfail.bind(app),
    onstop: app.stop.bind(app),
    onrace: app.onrace.bind(app),
  });

  app.inject();
  app.onStart(function(price) {
    runner.run(Number(petId()), prices[price]);
  }.bind(this));

  app.onStop(function(price) {
    runner.off();
  }.bind(this));
}
