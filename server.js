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

const register = require('./controllers/register.js');
const signIn = require('./controllers/signin');
const profile = require("./controllers/profile.js");
const image = require("./controllers/image.js");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//Allows data to be fetched.
app.use(cors());


//Environmental Varibles Example.
//Can be set through bash with the command: PORT=xxxx nodemon || PORT=xxxx node server.js
//Enviormental Variables can be used to set API keys, and to protect other sensitive data as well.
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.get("/", async (req, res) => {
  const data = await db.select('*').from('users');
  const users = await data.json();
  res.send(users);
});


//Example of dependcy injection
app.post("/signin", (req, res) => signIn.handleSignIn(req, res, bcrypt, db));


app.post('/register', (req, res) => register.handleRegister(req, res, bcrypt, db));


app.get("/profile/:id", (req, res) => profile.handleProfile(req, res, db));


app.put("/image", (req, res) => image.handleImage(req, res, db));

app.post("/imageurl", (req, res) => image.handleAPICall(req, res));
