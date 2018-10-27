class Remote {
  constructor(url, callback) {
    this.tmp = [];
    this.clients = [];
    this.url = url;
    this.callback = callback;
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.onmessage = this.onmessage.bind(this);
    this.ws.onclose = () => {
      this.ws = null
      setTimeout(this.connect.bind(this), 1000);
    }
  }

  onmessage(ev) {
    let data = JSON.parse(ev.data);
    if (data.type === 'pong') {
      if (this.tmp.indexOf(data.id) === -1) {
        this.tmp.push(data.id);
      }
    } else {
      this.callback(data);
    }
  }

  send(data) {
    if (this.ws) {
      this.ws.send(JSON.stringify(data));
    }
  }

  updateRemotes(cb) {
    this.tmp = [];
    this.send({ type: 'ping' });

    setTimeout(() => {
      this.clients = this.tmp.slice();
      if (cb) {
        cb(this.clients);
      }
    }, 1000);
  }
}

export default Remote;
