import Widget from './utils/widget';
import Runner from './utils/runner';
import Remote from './utils/remote';
import ext from './utils/ext';
import prices from './utils/prices';
import { pollAppend } from './utils/poll';

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

  function petId() {
    return window.location.href.replace(/^.+\/(\d+)$/,'$1');
  }
  //tagged.apps.pets3.api.getPet({ pet_id: '5460990113' }, function() { console.log(arguments) })
  let app;
  let isRemote = false;

  let remote = new Remote('wss://app-yexpwnmodw.now.sh', function(data) {
    if (data.type === 'share' && isRemote) {
      pollAppend(app, data);
    }
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
