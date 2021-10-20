const fs = require("fs");

//cek folder data
if (!fs.existsSync("./data")) {
  fs.mkdirSync("./data");
}

//cek file kontak.json
if (!fs.existsSync("./data/kontak.json")) {
  fs.writeFileSync("./data/kontak.json", "[]", "utf-8");
}

//Load all data
const loadKontak = () => {
  const file = fs.readFileSync("./data/kontak.json", "utf-8");
  const contacts = JSON.parse(file);
  return contacts;
};

//Find contact by name
const findContact = (nama) => {
  const contacts = loadKontak();
  const contact = contacts.find(
    (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
  );
  return contact;
};

//Add new file on JSON
const saveContact = (contacts) => {
  fs.writeFileSync("data/kontak.json", JSON.stringify(contacts));
};

//Add new contact
const addContact = (contact) => {
  const contacts = loadKontak();
  contacts.push(contact);
  saveContact(contacts);
};

//Duplicate Check
const duplicateCek = (nama) => {
  const contacts = loadKontak();
  return contacts.find((contact) => contact.nama === nama);
};

//Delete contact
const deleteContact = (nama) => {
  const contacts = loadKontak();
  const newContact = contacts.filter((contact) => contact.nama !== nama);

  saveContact(newContact);
};

//Edit contact
const updateContact = (kontakBaru) => {
  const contacts = loadKontak();

  const newContact = contacts.filter(
    (contact) => contact.nama !== kontakBaru.nama
  );

  delete kontakBaru.oldNama;
  newContact.push(kontakBaru);
  saveContact(newContact);
};

module.exports = {
  loadKontak,
  findContact,
  addContact,
  duplicateCek,
  deleteContact,
  updateContact,
};
