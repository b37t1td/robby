function bp(id) {
  var mp = Big('59235568581687470146620701612724868483225687720398878210090213855');
  var fp;
  var sl = 0;

  function buy(pet) {
    sl++;
    if (Big(pet.price).lessThan(mp)) {
      tagged.apps.pets3.api.putPetBuyAsync(pet, callback);
    }
  }

  function callback(status, data) {
    let pet = fp;
    if (data && data.userId) {
      pet = data;
    }
    console.log(status);
    if (status === 'price_change' && data) {
      if (data.pets && data.pets[0].userId) {
        pet.value = data.pets[0].value;
        pet.price = data.pets[0].value;
      }
      fp = pet;

      return buy(pet);
    }

    if (status === 'already_owner' || status === 'success') {
      return setTimeout(function() { buy(pet); }, 20000);
    }

    if (status === 'pet_run' || status === 'error') {
      var timeout = 2000;
      if (data && data.runInfo) {
        timeout = Number(data.runInfo.timeRemaining);
      }

      if (status === 'error') {
        console.log(status, data);
        return upup();
      }

      if (sl === 8) {
        sl = 0;
        return setTimeout(function() { upup(); }, 5000);
      }

      return setTimeout(function() { buy(pet); }, timeout - 4);
    }
  }

  function upup() {
    tagged.apps.pets3.api.getPet({ pet_id: id}, function(status, info) {
      let pet = info.pet;
      fp = pet;

      if (pet.userId !== id) {
        console.log('Pet id does not match');
        return;
      }

      buy(pet);
    });
  }

  upup();
}

