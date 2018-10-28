import Widget from './ui/widget';
import Runner from './utils/runner';
import Remote from './utils/remote';
import ext from './utils/ext';
import prices from './utils/prices';
import PollRunner from './utils/poll';
import RemotesWidget from './ui/list/remotes';
import Queue from './ui/list/queue';

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
    window.robby = {
      id: petId(),
      myid: Number(tagged.data.user_id),
      stats: {
        petRuns: [ ]
      }
    };
  }

  let app;
  let remote;
  let remotesWidget;
  let queueWidget;
  let isRemote = false;
  let poll = new PollRunner();
  window.robby.poll = poll;

  //let remote = new Remote('wss://app-yexpwnmodw.now.sh', function(data) {
  window.robby.remote = remote = new Remote('ws://127.0.0.1:9999', function(data) {
    let myid = window.robby.myid;

    function remoteSync() {
      if (isRemote) {
        remote.send({ type: 'force-pong',
          id: myid,
          stats: window.robby.stats,
          state: true
        });
      }
    }

    if (isRemote && data.type === 'share') {
      poll.append(data);
      remoteSync();
      return;
    }

    if (isRemote && data.type === 'remove') {
      poll.removePoll(data.id);
      remoteSync();
      return;
    }

    if (isRemote && data.type === 'ping') {
      remote.send({ type: 'pong', id: myid, stats: window.robby.stats });
      return;
    }

    if (!isRemote && data.type === 'pongs') {
      remotesWidget.update(data.pongs);
      return;
    }

    if (isRemote && data.type === 'buy-remote' && data.client === myid) {
      tagged.apps.pets3.api.getPet({ pet_id: data.pet }, (status, info) => {
        tagged.apps.pets3.api.putPetBuyAsync(info.pet, function() { });
      });
      return;
    }

    if (isRemote && data.type === 'run-remote' && data.client === myid) {
      poll.append(data);
      remoteSync();
      return;
    }

    if (isRemote && data.type === 'remove-remote' && data.client === myid) {
      poll.removePoll(data.pet);
      remoteSync();
      window.robby.updateTrigger();
      return;
    }
  });

  window.robby.app = app = new Widget({
    defaultPrice: '60',
    onshare: function(price, trigger) {
       if (trigger) {
        remote.send({ type: 'share',  id: petId(), price: price });
       } else {
        remote.send({ type: 'remove', id: petId() });
       }
    },
    onremote: function(trigger) {
      remote.send({ type: 'force-pong',
        id: Number(tagged.data.user_id),
        stats: window.robby.stats,
        state: trigger
      });
      remotesWidget.isRemote = isRemote = trigger;
      if (isRemote) {
        app.remotesBox.classList.remove('visible');
        queueWidget.on();
      } else {
        queueWidget.off();
      }
    }
  });

  queueWidget = new Queue(app);

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

  setTimeout(function() {
    remote.send({ type: 'sync-pongs' });
  }, 1000);
}
