//web server with Express
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const app = express();
const port = 3000;
const {
  loadKontak,
  findContact,
  addContact,
  duplicateCek,
  deleteContact,
} = require("./utils/contact.js");
const { body, validationResult, check } = require("express-validator");
const session = require("express-session");
const cookieparser = require("cookie-parser");
const flash = require("connect-flash");

//using EJS
app.set("view engine", "ejs");

//Third-party middleware
app.use(expressLayouts);
app.use(morgan("dev"));

//Built-in middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//Config Flash
app.use(cookieparser("secret"));
app.use(
  session({
    cookie: { maxAge: 5000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

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

//Contact Page
app.get("/contact", (req, res) => {
  const contacts = loadKontak();

  res.render("contact", {
    title: "Ini Halaman Contact",
    layout: "layout/main-layout",
    contacts,
    msg: req.flash("msg"),
  });
});

//Add contact page
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Add Contact",
    layout: "layout/main-layout",
  });
});

//Add data contact
app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const duplicate = duplicateCek(value);
      if (duplicate) {
        throw new Error("Name Already Exists!");
      }
      return true;
    }),
    check("email", "Wrong Email").isEmail(),
    check("noHP", "Wrong Phone Number").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("add-contact", {
        title: "Add Contact",
        layout: "layout/main-layout",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);

      //send flash message
      req.flash("msg", "Data entered successfully");
      res.redirect("/contact");
    }
  }
);

//Delete contact
app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  if (!contact) {
    res.status(404);
    res.send("Data not found");
  } else {
    deleteContact(req.params.nama);
    //send flash message
    req.flash("msg", "Data deleted successfully");
    res.redirect("/contact");
  }
});

//Edit data form
app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  res.render("edit-contact", {
    title: "Edit Contact",
    layout: "layout/main-layout",
    contact,
  });
});

//edit data
app.post(
  "/contact/update",
  [
    body("nama").custom((value, { req }) => {
      const duplicate = duplicateCek(value);
      if (value !== req.body.oldNama && duplicate) {
        throw new Error("Name Already Exists!");
      }
      return true;
    }),
    check("email", "Wrong Email").isEmail(),
    check("noHP", "Wrong Phone Number").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("edit-contact", {
        title: "Edit Contact",
        layout: "layout/main-layout",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      res.send(req.body);
      // addContact(req.body);
      // //send flash message
      // req.flash("msg", "Data entered successfully");
      // res.redirect("/contact");
    }
  }
);

//Detail contact page
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
