class Pet {
  constructor(id) {
    this.id = id;
    this.el = document.createElement('div');
    this.el.classList.add('remote-item');
    this.controlSubs = {};
    this.insertNode();
    tagged.apps.pets3.api.getPet({ pet_id: id }, this.fillNode.bind(this));
  }

  insertNode() {
    let box = document.createElement('div');
    box.classList.add('event-info');

    this.href = document.createElement('a');
    this.href1 = document.createElement('div');
    this.pic = document.createElement('img');
    let cell = document.createElement('div');
    this.name = document.createElement('span');
    this.name.classList.add('user-name');

    this.href.classList.add('cell');
    this.href.classList.add('id-photo-small');
    this.pic.classList.add('id-photo-small');
    this.href.appendChild(this.pic);
    this.href1.appendChild(this.name);
    cell.classList.add('cell');
    cell.appendChild(this.href1);


    this.controlsBox = document.createElement('div');
    this.controlsBox.classList.add('controls-box');
    this.statsBox = document.createElement('div');
    this.statsBox.classList.add('stats-box');

    cell.appendChild(this.statsBox);
    cell.appendChild(this.controlsBox);

    box.appendChild(this.href);
    box.appendChild(cell);
    this.el.appendChild(box);
  }

  fillNode(status, info) {
    this.pic.setAttribute('src', info.pet.photoSmall);
    this.href.setAttribute('href', info.pet.profile_link);
//    this.href1.setAttribute('href', info.pet.profile_link);
    this.name.innerText = info.pet.displayName;

    if (this.stats) {
      this.updateStats();
    }
  }

  injectRemoteControls() {
    let runButton = document.createElement('a');
    runButton.setAttribute('href', '#');
    runButton.classList.add('run-btn');
    runButton.innerHTML = 'Run <i>▶</i>';

    let buyButton = document.createElement('button');
    buyButton.classList.add('buy-btn');
    buyButton.classList.add('greenBtn');
    buyButton.innerHTML = 'Buy Now!';

    runButton.addEventListener('click', this.runClick.bind(this));
    buyButton.addEventListener('click', this.buyClick.bind(this));

    this.controlsBox.appendChild(runButton);
    this.controlsBox.appendChild(buyButton);
  }

  updateStats(stats) {
    if (!stats) {
      stats = this.stats;
    } else {
      this.stats = stats;
    }

    if (!stats || !this.statsBox) {
      return;
    }

    for (let id of Object.keys(this.controlSubs)) {
      let sub = this.controlSubs[id];

      if (!(stats.petRuns.some((p) => p.id === sub.id))) {
        this.el.removeChild(sub.el);
        sub.remove();
        delete this.controlSubs[id];
      }
    }

    for (let run of stats.petRuns) {
      let pet;
      if (this.controlSubs[run.id]) {
        pet = this.controlSubs[run.id];
      } else {
        pet = new Pet(run.id);
        this.controlSubs[run.id] = pet;
        this.el.appendChild(pet.el);
        pet.el.classList.add('sub-run');

        let removeBtn = document.createElement('a');
        removeBtn.setAttribute('href', '#');
        removeBtn.classList.add('remove-btn');
        removeBtn.innerText = '✖';
        removeBtn.addEventListener('click', this.subRemoveClick.bind(this));
        pet.controlsBox.appendChild(removeBtn);
      }

      pet.statsBox.innerHTML = `
        <div>Stats:
          <span class="buy">${run.buy}</span> /
          <span class="fail">${run.fail}</span> /
          <span class="racer">${run.racer}</span>
        </div>
        `;
    }

  }

  runClick(e) {
    e.preventDefault();

    return false;
  }

  buyClick(e) {
    e.preventDefault();

    return false;
  }

  subRemoveClick(e) {
    e.preventDefault();

    return false;
  }

  remove() {
    this.el = null;
  }
}

export default Pet;
