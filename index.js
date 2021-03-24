// importing the express module
const express = require("express");

// initialized application
const app = express();

// using the middleware to process the body data
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data

// handle route
app.use("/user",require("./routes/UserRoutes"));

// port number ( get the port number from the environmental variable if not specified then use 3000)
const PORT = process.env.PORT || 3000;

// start the server
app.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});
