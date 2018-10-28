export var petId = function() {
  return Number(window.location.href.replace(/^.+\/(\d+)$/,'$1'));
}
