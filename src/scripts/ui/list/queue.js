import Pet from '../pet';

class Queue {
  constructor(app) {
    this.app = app;
    this.pets = [];
    this.isOff = false;
    window.robby.updateTrigger = this.update.bind(this);
  }

  off() {
    let runs = window.robby.stats.petRuns.map((r) => r.id);

    for (let run of runs) {
      window.robby.poll.removePoll(run);
    }

    this.update();
    this.clean();
    this.isOff = true;
  }

  on() {
    this.isOff = false;
    this.clean();
    this.update();
  }

  clean() {
    if (this.emptyElement && this.app.remoteStats) {
      this.app.remoteStats.removeChild(this.emptyElement);
      this.emptyElement = null;
    }
    let toastContainer = document.getElementById('alerts_toast_container');

    if (toastContainer) {
      document.getElementById('inner_container').removeChild(toastContainer);
    }
  }

  emptyBox() {
    this.emptyElement = document.createElement('h4');
    this.emptyElement.classList.add('empty-queue');
    this.emptyElement.innerText = 'Queue is Empty';

    this.app.remoteStats.appendChild(this.emptyElement);
  }

  update() {
    if (this.isOff) {
      return;
    }
    let runs = window.robby.stats.petRuns;
    let clients = runs.map((r) => r.id);

    let found = [];
    for (let p of this.pets) {
      if (clients.indexOf(p.id) === -1) {
        p.remove();
      } else {
        found.push(p.id);
      }
    }

    this.pets = this.pets.filter((p) => p.el !== null);
    let newPets = clients.filter((c) => found.indexOf(c) === -1);

    for (let n of newPets) {
      let pet = new Pet(n);
      this.pets.push(pet);

      pet.el.classList.add('sub-run');
      pet.removeBtn = document.createElement('a');
      pet.removeBtn.setAttribute('href', '#');
      pet.removeBtn.classList.add('remove-btn');
      pet.removeBtn.innerText = '✖';
      pet.removeBtn.addEventListener('click', pet.queueRemoveClick.bind(pet));
      pet.controlsBox.appendChild(pet.removeBtn);
    }

    for (let pet of this.pets) {
      let run = runs.filter((p) => pet.id === p.id)[0];
      pet.statsBox.innerHTML = `
        <div>Stats:
          <span class="price">${run.price}</span> /
          <span class="buy">${run.buy}</span> /
          <span class="fail">${run.fail}</span> /
          <span class="rice">${run.rice}</span>
        </div>
        `;
    }

    this.updateList(clients.map((c) => this.pets.filter((p) => p.id === c)[0]));

    if (!this.isOff && window.robby.stats.petRuns.length < 1) {
      this.emptyBox();
    }
  }

  updateList(pets) {
    let box = this.app.remoteStats;

    for (let i = 0; i < pets.length; i++) {
      let pet = pets[i];

      if (box.childNodes[i]) {
        box.replaceChild(pet.el, box.childNodes[i]);
      } else {
        box.appendChild(pet.el);
      }
    }

    let rdNodes = box.childNodes.length - pets.length;

    if (rdNodes > 0) {
      let totalNodes = box.childNodes.length - 1;
      for (let i = totalNodes; i > totalNodes - rdNodes; i--) {
        box.removeChild(box.childNodes[i]);
      }
    }
  }

}

export default Queue;
