const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "cb72222430eb463ab30a1b81ed7e0038",
});

const handleAPICall = async (req, res) => {
 try {
   const data = await app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input);
   await res.json(data);
 } catch (error) {
   res.status(400).json("Unable to work with API.")
 } 
};

const handleImage = async (req, res, db) => {
  const { id } = req.body;
  try {
    const entries = await db("users").where("id", "=", id).increment("entries", 1).returning("entries");
    if (entries.length) {
      res.json(entries[0]);
    }else{
      await Promise.reject(new Error());
    }
  } catch (err) {
    res.status(400).json("Unable to get entries from Database.")
  }
};

module.exports = {
  handleImage,
  handleAPICall
};