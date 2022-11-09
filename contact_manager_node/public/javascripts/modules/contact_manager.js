class ContactManager {
  constructor(model, view) {
    this.dataManager = model;
    this.viewManager = view;
    this.main = document.querySelector('main');
    this.editContact = false;

    this.onLoad();
    this.main.addEventListener('click', this.clickDelegator.bind(this));
    this.viewManager.bindSearch(this.handleSearch.bind(this));
  }

  async onLoad() {
    const contacts = await this.dataManager.getAllContacts();
    
    if (contacts.length > 0) {
      this.viewManager.displayContacts(contacts);
      this.viewManager.renderAvailableTags(this.dataManager.getTags());
    } else {
      this.viewManager.displayNoContacts();
    }
  }

  async clickDelegator(event) {
    event.preventDefault();
    let element = event.target;
    let id = element.id;

    if (id === 'actions-add-contact' || id === 'main-add-contact') {
      this.viewManager.displayForm(this.dataManager.getTags());
    }

    if (element.tagName === 'OPTION') {
      let tagsInput = element.closest('form').querySelector('#tags');
      let contactTags = !!tagsInput.value ? tagsInput.value.split(',') : [];
      let tagSelected = element.value;

      if (contactTags.includes(tagSelected)) {
        let index = contactTags.indexOf(tagSelected);
        contactTags.splice(index, 1);
      } else {
        contactTags.push(tagSelected);
      }

      if (contactTags.length === 0) {
        tagsInput.value = '';
      } else if (contactTags.length === 1) {
        tagsInput.value = contactTags[0];
      } else {
        tagsInput.value = contactTags.join(',');
      }
    }

    if (id === 'add-tag') {
      let tagInput = document.getElementById('tag-input');
      let tag = tagInput.value.trim();

      if (this.validTag(tag)) {
        this.dataManager.addTag(tag);
        this.viewManager.renderAvailableTags(this.dataManager.getTags());
      }
      
      tagInput.value = '';
    }

    if (id === 'delete-tag') {
      let tagInput = document.getElementById('tag-delete');
      this.dataManager.deleteTag(tagInput.value);
      this.viewManager.renderAvailableTags(this.dataManager.getTags());
      tagInput.value = '';
    }
    
    if (element.classList.contains('edit')) { 
      this.editContact = true;
      let contactId = element.closest('li').id.split('-')[1];
      document.getElementById('contact-form').firstElementChild.dataset.contactId = contactId;
      let contactInfo = this.dataManager.getContactInfo(Number(contactId));
      this.viewManager.prefillForm(contactInfo);
      this.viewManager.displayForm(this.dataManager.getTags());
    }

    if (id === 'contact-submit') {
      let form = element.closest('form');
      let json = this.formToJSON(form);

      if (this.editContact) {
        let id = form.firstElementChild.dataset.contactId;
        await this.dataManager.updateContact(json, id);
      } else {
        await this.dataManager.saveContact(json);
      }

      this.editContact = false;
      this.onLoad();
    }

    if (element.classList.contains('delete')) {
      // delete contact
      if (confirm('Are you sure you want to delete this contact?')) {
        let contactId = element.closest('li').id.split('-')[1];
        await this.dataManager.deleteContact(contactId);
        this.onLoad();
      }
    }

    if (id === 'contact-cancel') {
      let contacts = this.dataManager.getContacts();

      if (contacts.length > 0) {
        this.viewManager.displayContacts(contacts);
        this.viewManager.renderAvailableTags(this.dataManager.getTags());
      } else {
        this.viewManager.displayNoContacts();
      }
    }

    if (element.tagName === 'A') {
      let tagName = element.textContent;
      let contacts = this.dataManager.getContactsWithTag(tagName);
      this.viewManager.displayContacts(contacts);
    }
  }

  handleSearch(searchBar) {
    return this.dataManager.filterContactsBy(searchBar.value);
  }

  formToJSON(form) {
    let formData = new FormData(form);
    formData.delete('tag-select');
    let json = JSON.stringify(Object.fromEntries(formData));
    console.log(json);
    return json;
  }

  validTag(tag) {
    let regex = new RegExp(/^[a-z0-9]+$/, 'i');
    console.log(regex.test(tag));
    return regex.test(tag);
  }
}

export default ContactManager;