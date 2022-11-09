class ViewManager {
  constructor() {
    this.contactList = this.getElement('#contact-list');
    this.templates = this.registerTemplates();
    this.containers = this.registerContainers();
  }

  getElement(selector) {
    return document.querySelector(selector);
  }

  registerTemplates() {
    const contactScript = document.getElementById('contact-template');
    const contact = Handlebars.compile(contactScript.innerHTML);
    const contacts = Handlebars.compile(document.getElementById('contact-list-template').innerHTML);
    Handlebars.registerPartial('contact', contactScript.innerHTML);

    return {contact, contacts};
  }

  registerContainers() {
    return {
      actions: this.getElement('#actions-container'),
      tags: this.getElement('#tags-container'),
      contacts: this.getElement('#contacts-container'),
      noContacts: this.getElement('#no-contacts-container'),
      noMatches: this.getElement('#no-matches-container'),
      form: this.getElement('#contact-form-container')
    }
  }

  bindSearch(handler) {
    const searchInput = document.getElementById('search-contacts');

    searchInput.addEventListener('input', event => {
      event.preventDefault();
      let searchInput = event.target;
      let contacts = handler(searchInput);
      
      if (contacts.length === 0) {
        this.displayNoMatches(searchInput.value);
      } else {
        this.displayContacts(contacts);
      }
    });
  }

  displayContacts(contacts) {
    this.hideAllViews();
    this.containers.form.firstElementChild.reset();
    this.contactList.textContent = '';
    let html = this.templates.contacts({contacts});
    this.contactList.insertAdjacentHTML('afterbegin', html);
    this.showActionsContainer();
    this.showTagsContainer();
    this.showContactsContainer();
  }

  renderAvailableTags(tags) {
    const tagList = this.getElement('#tag-list');
    tagList.textContent = '';

    tags.forEach(tag => {
      let listItem = document.createElement('li');
      let link = document.createElement('a');
      link.href = '#';
      link.textContent = tag;

      listItem.appendChild(link);
      tagList.appendChild(listItem);
    });
  }

  displayNoContacts() {
    this.hideAllViews();
    this.showActionsContainer();
    this.showNoContactsContainer();
  }

  displayNoMatches(msgString) {
    let span = document.getElementById('search-chars');
    span.textContent = msgString;

    this.hideAllViews();
    this.showActionsContainer();
    this.showNoMatchesContainer();
  }

  displayForm(tags) {
    this.hideAllViews();
    this.addTagsToForm(tags)
    this.showFormContainer();
  }

  addTagsToForm(tags) {
    const tagSelect = this.getElement('#tag-selector');
    
    while (tagSelect.firstElementChild.nextElementSibling) {
      tagSelect.removeChild(tagSelect.firstElementChild.nextElementSibling);
      console.log('hell')
    }

    tags.forEach(tag => {
      let option = document.createElement('option');
      option.value = tag;
      option.textContent = tag;

      tagSelect.appendChild(option);
    });
  }

  prefillForm(contactInfo) {
    let ul = this.containers.form.firstElementChild;
    let nameInput = document.getElementById('name');
    let emailInput = document.getElementById('email');
    let phoneInput = document.getElementById('phone-number');
    let tagInput = document.getElementById('tags');


    ul.dataset.contactId = contactInfo.id;
    nameInput.value = contactInfo.full_name;
    emailInput.value = contactInfo.email;
    phoneInput.value = contactInfo.phone_number;
    tagInput.value = contactInfo.tags;
  }

  hideAllViews() {
    Object.keys(this.containers).forEach(key => {
      this.containers[key].classList.add('hide');
    });
  }

  showActionsContainer() {
    this.containers.actions.classList.remove('hide');
  }

  showTagsContainer() {
    this.containers.tags.classList.remove('hide');
  }

  showContactsContainer() {
    this.containers.contacts.classList.remove('hide');
  }

  showNoContactsContainer() {
    this.containers.noContacts.classList.remove('hide');
  }

  showNoMatchesContainer() {
    this.containers.noMatches.classList.remove('hide');
  }

  showFormContainer() {
    this.containers.form.classList.remove('hide');
  }
}

export default ViewManager;