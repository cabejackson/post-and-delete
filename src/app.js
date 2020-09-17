require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { v4: uuid } = require("uuid");
const { NODE_ENV } = require("./config");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(express.json());
app.get("/caleb", (req, res) => {
  res.send("Hello, Caleb!");
});
// const fakeUser = [
//"id": "707057ba-ac61-421d-8737-8de88cd8779e"
//   {
//     id: UUID,
//     firstName: String,
//     lastName: String,
//     address1: String,
//     address2: String,
//     city: String,
//     state: String,
//     zip: Number
//   }
// ];

const adresses = [
  {
    id: "3c8da4d5-1597-46e7-baa1-e402aed70d80",
    firstName: "Marcus",
    lastName: "Johnson",
    address1: "1600 Penn Ave. NW ",
    address2: "false",
    city: "Washington",
    state: "DC",
    zip: "20500"
  },
  {
    id: "3c8da4d5-1597-46e7-baa1-e402aed70d80",
    firstName: "Shauna",
    lastName: "RandomLastName",
    address1: "350 Fifth Ave.",
    address2: "Apt #000",
    city: "New York",
    state: "NY",
    zip: "10118"
  }
];

// app.get("/", (req, res) => {
//   res.send("Hello, world!");
// });
app.post("/", (req, res) => {
  console.log(req.body);
  res.send("POST request received.");
});
app.get("/", (req, res) => {
  res.send("A GET Request");
});

// Notes: Beginning to "Constructing the Response"
//Decide between 204 and 201
// res.status(204).end();
// res.status(201).location(`http://localhost:8000/user/${id}`).json({ id: id });

app.post("/address", (req, res) => {
  console.log(req.body);
  // get the data
  const {
    firstName,
    lastName,
    address1,
    address2 = false,
    city,
    state,
    zip
  } = req.body;

  // validation code here
  if (!firstName) {
    return res.status(400).send("firstName required");
  }

  if (!lastName) {
    return res.status(400).send("lastName required");
  }

  if (!address1) {
    return res.status(400).send("address1 required");
  }

  if (!city) {
    return res.status(400).send("city required");
  }
  if (!state) {
    return res.status(400).send("state required");
  }
  if (!zip) {
    return res.status(400).send("zip required");
  }
  //become even more specific

  // state length
  if (state.length !== 2) {
    return res.status(400).send("State must only be 2 characters. EX: TX");
  }

  // zipcode length & type
  // add conditional saying it must be a number
  if (zip.length !== 5) {
    return res.status(400).send("Zipcode must must be exactly 5 characters");
  }

  //here's how the clubs can be validated
  // could replace this with state to make them "real"
  // const clubs = [
  //   "Cache Valley Stone Society",
  //   "Ogden Curling Club",
  //   "Park City Curling Club",
  //   "Salt City Curling Club",
  //   "Utah Olympic Oval Curling Club"
  // ];

  // // make sure the club is valid
  // if (!clubs.includes(favoriteClub)) {
  //   return res.status(400).send("Not a valid club");
  // }

  const id = uuid(); // generate a unique id
  const newAddy = {
    id,
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip
  };

  adresses.push(newAddy);
  res.status(201).location(`http://localhost:8000/list/${id}`).json({ id: id });
  res.json(newAddy);

  // at this point all validation passed
  res.send("All validation passed");
});

// app.delete("/user/:userId", (req, res) => {
//   const { userId } = req.params;
//   console.log(userId);
//   res.send("Got it.");
// });
app.get("/list", (req, res) => {
  res.json(adresses);
});

app.delete("/adresses/:userId", (req, res) => {
  const { userId } = req.params;

  const index = adresses.findIndex((u) => u.id === userId);

  // make sure we actually find a user with that id
  //but what is this line below saying?
  if (index === -1) {
    return res.status(404).send("User not found");
  }

  users.splice(index, 1);

  res.send("Deleted");
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

app.use(cors());

module.exports = app;
