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
    let name = document.createElement('div');

    href.classList.add('cell'); href.classList.add('id-photo-small');
    pic.classList.add('id-photo-small');
    pic.setAttribute('src', info.pet.photoSmall);
    href.appendChild(pic);
    href.setAttribute('href', info.pet.profile_link);
    href1.setAttribute('href', info.pet.profile_link);
    name.classList.add('cell');
    name.innerText = info.pet.displayName;
    href1.appendChild(name);

    box.appendChild(href);
    box.appendChild(href1);
    this.el.appendChild(box);
  }

  remove() {
    this.el = null;
  }
}

export default Pet;
