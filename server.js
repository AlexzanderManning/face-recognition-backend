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




app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});


app.get("/", (req, res) => {
  const { users } = database;
  res.send(users);
});


app.post("/signin", (req, res) => {
  db.select('email', 'hash').from('login')
  .where('email', '=', req.body.email)
  .then(data => {
    const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
    if (isValid){
      return db.select('*').from('users')
        .where('email', '=', req.body.email)
        .then(user => {
          res.json(user[0])
        })
        .catch(err => res.status(400).json('Unable to get user'))
    }else{
      res.status(400).json('wrong credentials');
    }
  })
  .catch(err => res.status(400).json('wrong credentials'))
});


app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);

  //Create a transaction whe you have to update more than one table at once.
    db.transaction((trx) => {
      trx
        .insert({
          hash: hash,
          email: email,
        })
        .into("login")
        .returning("email")
        .then((loginEmail) => {
          return trx("users")
            .returning("*")
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date(),
            })
            .then((user) => {
              res.json(user[0]);
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    }).catch((err) => res.status(400).json("unable to register"));
    
});


app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  db.select('*').from('users').where({
    id: id
  })
    .then(user => {
      if(user.length){
        res.json(user[0]);
      }else{
        res.status(400).json('Not Found')
      }
      
    })
    .catch(err => res.status(400).json('Error Getting User'));
});

app.put("/image", (req, res) => {
  const { id } = req.body;

  db('users').where('id', '=', id).increment('entries', 1)
    .returning('entries')
    .then(entries => {
      if(entries.length){
         res.json(entries[0]);
      }else{
        res.status(400).json("Unable to get entries");
      }
    })
    .catch(err => res.status(400).res.json('Unable to get entries'));
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