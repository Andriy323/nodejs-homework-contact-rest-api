const fs = require("fs/promises");

const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

const getContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const contact = await getContacts();
  const resultContact = contact.find((item) => item.id === contactId);
  return resultContact || null;
};

const removeContact = async (contactId) => {
  const contact = await getContacts();
  const id = contact.findIndex((item) => item.id === contactId);
  if (id === -1) {
    return;
  }
  const [result] = contact.splice(id, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contact, null, 2));
  return result;
};

const addContact = async ({ name, email, phone }) => {
  const contact = await getContacts();

  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contact.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contact, null, 2));
  return newContact;
};
const updateContact = async (id, body) => {
  const contact = await getContacts();
  const index = contact.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }
  contact[index] = { id, ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contact, null, 2));
  return contact[index];
};

module.exports = {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
