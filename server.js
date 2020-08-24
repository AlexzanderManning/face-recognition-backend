const express = require("express");
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const db = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "deontemanning",
    password: "",
    database: "face-recognition",
  },
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "John",
      password: "cookies",
      email: "john@gmail.com",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "1234",
      name: "Sally",
      password: "bananas",
      email: "sally@gmail.com",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: "john@gmail.com"
    }
  ]
};



app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});


app.get("/", (req, res) => {
  const { users } = database;
  res.send(users);
});


app.post("/signin", (req, res) => {
  bcrypt.compare(
    "apples",
    "$2a$10$XlEmCMjGGWNH.vdyfKn3yumfrLifwoB69JgyRv34mo/CNYxLZJGKK",
    function (err, res) {
      // res == true
      console.log("first Guess");
    }
  );
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("Error Logging In");
  }
});


app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, function (err, hash) {
    console.log(hash);
    // Store hash in your password DB.
  });

  db('users').returning('*').insert({
    email: email,
    name: name,
    joined: new Date()
  })
    .then(user => {
      console.log(user);
      res.json(user[0]);
    })
    .catch(err => res.status(400).json('Unable to register'));
});


app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;

  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });

  if (!found) {
    res.status(400).json("User not found");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;

  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });

  if (!found) {
    res.status(400).json("User not found");
  }
});

//BCrypt

// bcrypt.hash("bacon", null, null, function (err, hash) {
//   // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function (err, res) {
//   // res == true
// });
// bcrypt.compare("veggies", hash, function (err, res) {
//   // res = false
// });