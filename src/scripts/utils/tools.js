export var petId = function() {
  return Number(window.location.href.replace(/^.+\/(\d+)$/,'$1'));
}

export var myId = function() {
  return Number(tagged.data.user_id);
}
