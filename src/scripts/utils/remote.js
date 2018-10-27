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
    this.callback(data);
  }

  send(data) {
    if (this.ws) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

export default Remote;
