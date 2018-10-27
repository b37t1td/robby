import Runner from './runner';
import prices from './prices';

function getStats(id) {
  for (let s of window.robby.stats.petRuns) {
    if (s.id === id) {
      return s;
    }
  }
}

function getPoll(id) {
  for (let s of poll) {
    if (s.id === id) {
      return s;
    }
  }
}

let poll = [];

class Poll {
  constructor() {

  }

  removePoll(id) {
    for (let idx = 0; idx < poll.length; idx++) {
      if (poll[idx].pet.id === id) {
        poll[idx].runner.off();
        poll.splice(idx, 1);
        window.robby.stats.petRuns.splice(idx, 1);
        break;
      }
    }
  }

  append(data) {
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
      onbuy: function() {
        let stats = getStats(data.id);
        stats.buy++;
      },
      onfail: function() {
        let stats = getStats(data.id);
        stats.fail++;
      },
      onstop: (id) => { this.removePoll(id); },
      onrace: function(rice) {
        let stats = getStats(data.id);
        stats.rice = rice;
      },
    });

    poll.push({
      runner: runner,
      pet: data
    });

    window.robby.stats.petRuns.push({
      id: data.id,
      buy: 0,
      fail: 0,
      rice: 0
    });

    runner.run(data.id, prices[data.price]);
  }
}

export default Poll;
