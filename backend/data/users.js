const bcrypt = require("bcrypt");

const users = [
  {
    name: "Admin user",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
  {
    name: "John Doe",
    email: "john@gmail.com",
    password: bcrypt.hashSync("123457", 10),
    isAdmin: false,
  },
  {
    name: "David boose",
    email: "david@gmail.com",
    password: bcrypt.hashSync("123459", 10),
    isAdmin: false,
  },
];

module.exports = users;
