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

module.exports = { loadKontak, findContact };
