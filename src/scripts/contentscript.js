import Widget from './ui/widget';
import Runner from './utils/runner';
import Remote from './utils/remote';
import ext from './utils/ext';
import prices from './utils/prices';
import { pollAppend } from './utils/poll';
import RemotesWidget from './ui/list/remotes';

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
    return Number(window.location.href.replace(/^.+\/(\d+)$/,'$1'));
  }

  if (!window.robby) {
    window.robby = { };
  } else {
    clearInterval(window.robby.syncRemotes);
  }

  let app;
  let remotesWidget;
  let isRemote = false;

  //let remote = new Remote('wss://app-yexpwnmodw.now.sh', function(data) {
  let remote = new Remote('ws://127.0.0.1:9999', function(data) {
    if (!isRemote) { return; }

    if (data.type === 'share') {
      pollAppend(app, data);
    }

    if (data.type === 'ping') {
      remote.send({ type: 'pong', id: Number(tagged.data.user_id) });
    }
  });

  window.robby.app = app = new Widget({
    defaultPrice: '60',
    onshare: function(price) {
      //  remote.send({ type: 'share',  id: petId(), price: price });
    },
    onremote: function(trigger) {
      remotesWidget.isRemote = isRemote = trigger;
      if (isRemote) {
        app.remotesBox.classList.remove('visible');
      }
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
    runner.run(petId(), prices[price]);
  }.bind(this));

  app.onStop(function(price) {
    runner.off();
  }.bind(this));

  remotesWidget = new RemotesWidget(app);

  window.robby.syncRemotes = setInterval(function() {
    if (!isRemote) {
      remote.updateRemotes(function(a) {
        remotesWidget.update(a);
      });
    }
  }, 2000);
}
