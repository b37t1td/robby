import Runner from './runner';
import prices from './prices';

let poll = [];

export var pollAppend = function(app, data) {
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
}
