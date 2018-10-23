function Runner(options) {
  this.opt = options;
  this.sl = 0;
  this.fp = {};
  this.stop = false;
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
    tagged.apps.pets3.api.putPetBuyAsync(pet, this.callback.bind(this));
  } else {
    this.opt.onstop();
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

    return this.buy(pet);
  }

  if (status === 'already_owner' || status === 'success') {
    if (this.onown) {
      this.onown = false;
      this.opt.onbuy();
    }
    return setTimeout(() => { this.upup(); }, 6000);
  }

  this.onown = true;

  if (status === 'pet_run' || status === 'error') {
    var timeout = 2000;
    if (data && data.runInfo) {
      timeout = Number(data.runInfo.timeRemaining);
      this.opt.onrace(data.runInfo.racerCount);
    }

    if (status === 'error') {
      this.opt.onfail();
//      console.log(status, data);
      return this.upup();
    }

    if (this.sl === 8) {
      this.opt.onfail();
      this.sl = 0;
      return setTimeout(() => { this.upup(); }, 4000);
    }

    this.opt.onfail();
    let rtimeout = timeout - (2 + Math.floor(Math.random() * 10));

    return setTimeout(() => { this.buy(pet); }, rtimeout);
  }
}

Runner.prototype.upup = function() {
  tagged.apps.pets3.api.getPet({ pet_id: this.id}, (status, info) => {
    let pet = info.pet;
    this.fp = pet;

    if (pet.userId !== this.id) {
      console.log('Pet id does not match');
      return;
    }

    this.buy(pet);
  });
}

export default Runner;
