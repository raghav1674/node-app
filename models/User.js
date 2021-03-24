// importing mongoose
const mongoose = require("mongoose");

// import the configuration
require('dotenv').config()

// connect to the database
mongoose.connect(

  
  process.env.MOGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// getting the connection object
const db = mongoose.connection;

// checking if connection is successull or not 
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Mongodb connected");
});

// defining the schema for our User
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
  },
});

// creating the model from the schema defined above
const UserModel = mongoose.model("User", UserSchema);


// exporting the model so that we can use it in another file

module.exports = UserModel;


