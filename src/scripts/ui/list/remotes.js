import Pet from '../pet';
import { petId, myId } from '../../utils/tools';

class Remotes {
  constructor(app) {
    this.box = document.createElement('div');
    this.box.classList.add('remotes-list');
    this.pets = [];
    this.app = app;
    app.remotesBox.appendChild(this.box);
  }

  update(pongs) {
    // home
    if (petId() === myId()) {
      pongs = [];
    }

    let clients = pongs.map((p) => p.id);

    if (clients.length > 0 && !this.isRemote) {
      this.app.remotesBox.classList.add('visible');
      this.app.totalRemotes.innerText = clients.length;
    } else {
      this.app.remotesBox.classList.remove('visible');
    }
    clients = clients.sort(function(a,b) { return a - b });
    // Removing pets
    let found = [];
    for (let p of this.pets) {
      if (clients.indexOf(p.id) === -1) {
        p.remove();
      } else {
        let pong = pongs.filter((s) => p.id === s.id)[0];
        p.updateStats(pong.stats);
        found.push(p.id);
      }
    }

    this.pets = this.pets.filter((p) => p.el !== null);
    let newRemotes = clients.filter((c) => found.indexOf(c) === -1);

    for (let n of newRemotes) {
      let pong = pongs.filter((p) => p.id === n)[0];
      let pet = new Pet(n);
      pet.updateStats(pong.stats);
      pet.injectRemoteControls();
      this.pets.push(pet);
    }

    this.updateList(clients.map((c) => this.pets.filter((p) => p.id === c)[0]));
  }

  updateList(pets) {
    for (let i = 0; i < pets.length; i++) {
      let pet = pets[i];

      if (this.box.childNodes[i]) {
        this.box.replaceChild(pet.el, this.box.childNodes[i]);
      } else {
        this.box.appendChild(pet.el);
      }
    }

    let rdNodes = this.box.childNodes.length - pets.length;

    if (rdNodes > 0) {
      let totalNodes = this.box.childNodes.length - 1;
      for (let i = totalNodes; i > totalNodes - rdNodes; i--) {
        this.box.removeChild(this.box.childNodes[i]);
      }
    }
  }
}

export default Remotes;
