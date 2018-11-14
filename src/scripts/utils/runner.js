import { myId } from './tools';

function Runner(options) {
  this.opt = options;
  this.sl = Math.ceil(Math.random() * 4);
  this.fp = {};
  this.stop = false;
  this.change = 0;
}

Runner.prototype.run = function(id, price) {
  this.id = id;
  this.stop = false;
  this.price = Big(price);
  this.upup();
}

Runner.prototype.off = function() {
  this.stop = true;
}

Runner.prototype.buy = function(pet) {
  this.sl++;
  if (!this.stop && Big(pet.price).lessThan(this.price)) {
    pet.type = 'events';

    tagged.apps.pets3.api.putPetBuyAsync(pet, this.callback.bind(this));
  } else {
    this.opt.onstop(this.id);
  }
}

Runner.prototype.callback = function callback(status, data) {
  let pet = this.fp;

  if (data && data.userId) {
    pet = data;
  }
  //  console.log(status, data);

  if (status === 'price_change' && data) {

    if (data.pets && data.pets[0].userId) {
      pet.value = data.pets[0].value;
      pet.price = data.pets[0].value;
    }

    this.fp = pet;
    this.change += 1;

    if (this.change > 1) {
      let step = 1;

      if (this.change > 2) {
        step = 20;
      }

      window.robby.app.delayWidget.setDelay(Number(window.robby.delay - step));
    }

    if (this.change > 2) {
      return setTimeout(() => { this.buy(pet); }, 500);
    }

    return this.buy(pet);
  }

  this.change = 0;

  if (status === 'already_owner' || status === 'success') {
    if (this.oldPrice !== pet.price) {
      this.oldPrice = pet.price;
      this.sl = 0;
      this.opt.onbuy();
    }
    return setTimeout(() => { this.upup(); }, 8000);
  }

  if (status === 'pet_run' || status === 'error') {
    var timeout = 1000;
    if (data && data.runInfo) {
      timeout = Number(data.runInfo.timeRemaining);

      if (Number(data.runInfo.racerCount) > 15) {
        window.robby.app.delayWidget.setDelay(Number(window.robby.delay + 1));
      }
//      else if (Number(data.runInfo.racerCount) < 5) {
//        window.robby.app.delayWidget.setDelay(Number(window.robby.delay - 1));
//      }

      this.opt.onrace(data.runInfo.racerCount);
    }

    if (status === 'error') {
      this.opt.onfail();
//      console.log(status, data);
      return this.upup();
    }

    if (this.sl === 8) {
      this.opt.onfail();
      this.sl = Math.ceil(Math.random() * 2);
      return setTimeout(() => { this.upup(); }, 2000);
    }

    this.opt.onfail();
    let rtimeout = timeout - (Number(window.robby.delay) * 10);

    if (rtimeout < 1) {
      rtimeout = 1;
    }

    return setTimeout(() => { this.buy(pet); }, rtimeout);
  }
}

Runner.prototype.upup = function() {
  tagged.apps.pets3.api.getPet({ pet_id: this.id}, (status, info) => {
    let pet = info.pet;
    this.fp = pet;

    //console.log('upup', status, info);
    if (status === 'success' && Number(info.owner.userId) === myId()) {
      //  console.log('already owner restarting');
      return setTimeout(this.upup.bind(this), 1000);
    }

    if (pet.userId !== this.id) {
      console.log('Pet id does not match');
      return;
    }

    this.buy(pet);
  });
}

export default Runner;
