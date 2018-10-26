class Remote {
  constructor(url, callback) {
    this.url = url;
    this.callback = callback;
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.onmessage = this.onmessage.bind(this);
    this.ws.onclose = () => {
      this.ws = null
      setTimout(this.connect.bind(this), 1000);
    }
  }

  onmessage(ev) {
    this.callback(JSON.parse(ev.data));
  }

  send(data) {
    this.ws.send(JSON.stringify(data));
  }
}

export default Remote;
