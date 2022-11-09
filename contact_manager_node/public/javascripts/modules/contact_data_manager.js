class DataManager {
  constructor() {
    this.data = { contacts: [], tags: [], addedTags: [] };
  }

  getAllContacts() {
    return fetch('/api/contacts')
      .then(response => response.json())
      .then(contacts_json => {
        this.data.contacts = contacts_json;
        this.data.tags = this.getTagsFrom(contacts_json);
        return contacts_json;
      })
      .catch(error => alert(error));
  }

  saveContact(json) {
    fetch('/api/contacts/',  {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: json
    });
  }

  updateContact(json, id) {
    fetch(`/api/contacts/${id}`,  {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: json
    });
  }

  deleteContact(id) {
    fetch(`/api/contacts/${id}`, {
      method: 'DELETE'
    });
  }

  getContacts() {
    return this.data.contacts;
  }

  getContactInfo(id) {
    return this.data.contacts.find(contact => {
      return contact.id === id;
    });
  }

  getTagsFrom(contacts) {
    let allTags = [];

    contacts.forEach(({tags}) => {
      if (tags) {
        let tagsArr = tags.split(',');
        allTags.push(...tagsArr);
      }
    });

    return allTags.filter((tag, idx) => allTags.indexOf(tag) === idx);
  }

  getContactsWithTag(tagName) {
    return this.data.contacts.filter(({tags}) => {
      if (tags) {
        return tags.split(',').includes(tagName);
      }
    });
  }

  filterContactsBy(searchValue) {
    let regex = new RegExp(searchValue, 'i');

    return this.data.contacts.filter(({full_name}) => {
      return regex.test(full_name);
    });
  }

  getTags() {
    let tags = this.data.tags.filter(tag => {
      return !this.data.addedTags.includes(tag);
    });

    return tags.concat(this.data.addedTags);
  }

  addTag(tag) {
    if (!this.data.addedTags.includes(tag) && !this.data.tags.includes(tag)) {
      this.data.addedTags.push(tag);
    }
  }

  deleteTag(tag) {
    if (this.data.addedTags.includes(tag) && !this.data.tags.includes(tag)) {
      let index = this.data.addedTags.indexOf(tag);
      this.data.addedTags.splice(index, 1);
    }
  }
}

export default DataManager;