//web server with Express
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const app = express();
const port = 2000;
const { loadKontak, findContact } = require("./utils/contact.js");

//using EJS
app.set("view engine", "ejs");

//Third-party middleware
app.use(expressLayouts);
app.use(morgan("dev"));

//Built-in middleware
app.use(express.static("public"));

app.get("/", (req, res) => {
  // res.sendFile("./index.html", { root: __dirname });
  const user = [
    {
      nama: "Bambang",
      email: "bambang@gmail.com",
    },
    {
      nama: "Pamungkas",
      email: "pamungkas@gmail.com",
    },
  ];
  res.render("index", {
    nama: "Bambang",
    user,
    layout: "layout/main-layout",
    title: "Ini Home",
  });
});

app.get("/about", (req, res) => {
  // res.sendFile("./about.html", { root: __dirname });
  res.render("about", {
    title: "Ini Halaman About",
    layout: "layout/main-layout",
  });
});

app.get("/contact", (req, res) => {
  const contacts = loadKontak();

  res.render("contact", {
    title: "Ini Halaman Contact",
    layout: "layout/main-layout",
    contacts,
  });
});

app.get("/contact/:nama", (req, res) => {
  const detailKontak = findContact(req.params.nama);

  res.render("detail", {
    title: "Detail",
    layout: "layout/main-layout",
    detailKontak,
  });
});

app.use("", (req, res) => {
  res.status(404);
  res.send("Page Not Found");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
