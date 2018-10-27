class Pet {
  constructor(id) {
    this.id = id;
    this.el = document.createElement('div');
    this.el.classList.add('remote-item');
    tagged.apps.pets3.api.getPet({ pet_id: id }, this.fillNode.bind(this));
  }

  fillNode(status, info) {
    let box = document.createElement('div');
    box.classList.add('event-info');

    let href = document.createElement('a');
    let href1 = document.createElement('a');
    let pic = document.createElement('img');
    let cell = document.createElement('div');
    let name = document.createElement('span');

    href.classList.add('cell'); href.classList.add('id-photo-small');
    pic.classList.add('id-photo-small');
    pic.setAttribute('src', info.pet.photoSmall);
    href.appendChild(pic);
    href.setAttribute('href', info.pet.profile_link);
    href1.setAttribute('href', info.pet.profile_link);
    name.innerText = info.pet.displayName;
    href1.appendChild(name);
    cell.classList.add('cell');
    cell.appendChild(href1);


    this.controlsBox = document.createElement('div');
    this.controlsBox.classList.add('controls-box');
    this.statsBox = document.createElement('div');
    this.statsBox.classList.add('stats-box');

    cell.appendChild(this.statsBox);
    cell.appendChild(this.controlsBox);

    box.appendChild(href);
    box.appendChild(cell);
    this.el.appendChild(box);
  }

  remove() {
    this.el = null;
  }
}

export default Pet;
