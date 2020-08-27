//Removed Bcrypt from server.js signin.js and register.js

//TODO -> add another hashing library.

const express = require("express");
const app = express();
// const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

//Heroku database url is an enviorment variable.
const db = require("knex")({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
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
//Can be used to set databse URLs also.
//Environmental variables are really importeant for secrets and things that should be dynamic like ports.
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.get("/", async (req, res) => res.send(db.users));


//Example of dependcy injection
app.post("/signin", (req, res) => signIn.handleSignIn(req, res, db));

app.post("/register", (req, res) => register.handleRegister(req, res, db));

app.get("/profile/:id", (req, res) => profile.handleProfile(req, res, db));

app.put("/image", (req, res) => image.handleImage(req, res, db));

app.post("/imageurl", (req, res) => image.handleAPICall(req, res));
