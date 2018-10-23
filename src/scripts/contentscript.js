import Widget from './utils/widget';

let app = new Widget({
  defaultPrice: '60'
});

app.inject();
app.onStart(function(price) {
  console.log('start', price);
  app.onbuy();
});

app.onStop(function(price) {
  console.log('stop', price);
});
