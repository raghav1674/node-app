// creating a router to handle routes 
const router = require("express").Router();

// importing user Model for interacting with Mongodb
const UserModel = require("../models/User");


//  route for get all users
router.get("/", (request, response) => {

    // fetching all the users from mongodb
    UserModel.find({}, function (err, users) {
      // if there is no error show the success response
      if (!err) {
        response.status(200).json(users);
      } else {
        // if there is an error, then send the error response
        response.status(500).json({
          error:
            "Some Server Internal Error, Either not able to connect to server or mongodb server",
        });
      }
    });
  });
  
  // route for get user  by id
  router.get("/:id", (request, response) => {
    const id = request.params.id;
  
    // get user by id  and etch name,age and phoneNumber corresponding to that id
    UserModel.findById(id, {
      name: true,
      age: true,
      phoneNumber: true,
    })
      .exec()
      // if its a success then show the success response to the client
      .then((user) => {
        response.status(200).json(user);
   
      })
      // if there is an error then send the error response , can't find user with such id
      .catch((err) => {
        respone.status(404).json({ error: "Cannot find user with this id" });
 
      });

    
  });
  
  // route to  create a new user
  router.post("/", (request, response) => {
    // creating a new user
  
    // if all the fields are available in the body then create the user else send error response
    if (
      request.body.name &&
      request.body.age &&
      request.body.phoneNumber
    ) {
      // creating a new user
      const newUser = new UserModel({
        name: request.body.name,
        // parse into integer as the body data will be in string
        age: request.body.age,
        phoneNumber: request.body.phoneNumber,
      });
  
      // save or add to the database
      newUser.save((err, user) => {
        // if there is an error then it might be related (some fields missing or duplicate entry)
        if (!err) {
          response.status(200).json(user);
        } else {
          // if there is an error
          response.status(400).json({ error: "Duplicate entry not allowed" });
        }
      });
    } else {
      response
        .status(400)
        .json({ error: "Please provide Name , Age and PhoneNumber fields" });
    }
  });
  
  // route to update a user
  router.put("/edit/:id", (request, response) => {
    // retrieving the id from the url
    const id = request.params.id;
  
    // updating the userage and userPhoneNumber
    UserModel.findById(id, {
      name: true,
      age: true,
      phoneNumber: true,
    })
      .exec()
      .then((userToUpdate) => {
        // checking which fields are to be updated
        const newAge = request.body.age
          ? request.body.age
          : userToUpdate.age;
        const newPhoneNumber = request.body.phoneNumber
          ? request.body.phoneNumber
          : userToUpdate.phoneNumber;
  
        userToUpdate.age = newAge;
        userToUpdate.phoneNumber = newPhoneNumber;
  
        // save the updated user to the db
        userToUpdate
          .save((err, user) => {
            // if there is an error then it might be related (some fields missing or duplicate entry)
            if (!err) {
              response.status(200).json({ success: "User updated successfully" });
              return;
            } else {
              // if there is an error
              response.status(400).json({ error: "Duplicate entry not allowed" });
            }
          })
        })
          .catch((err) => {
            response.status(404).json({ error: "Cannot find user with this id" });
          });
   
  });
  
  // route to delete a User
  router.delete("/delete/:id", (request, response) => {
    const id = request.params.id;
  
    // mongodb check if id exists or not
    UserModel.remove({ _id: id })
      // if success then send success response
      .then((_) =>
        response.status(200).json({ success: "Deleted user successfully " })
      )
      .catch((err) =>
        response.status(404).json({ error: "Cannot find user with this id" })
      );
  });


  // export the route 
 module.exports = router;