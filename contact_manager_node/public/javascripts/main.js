import ContactManager from './modules/contact_manager.js';
import DataManager from './modules/contact_data_manager.js';
import ViewManager from './modules/contact_view_manager.js';

document.addEventListener('DOMContentLoaded', () => {
  const contactManager = new ContactManager(new DataManager(), new ViewManager());
});