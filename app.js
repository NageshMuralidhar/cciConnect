var express = require("express");

var app = express();

// server deployment
app.set("view engine", "ejs");
app.use("/assets", express.static("assets"));

var controller = require("./routes/ProfileController.js");

app.use("/", controller);

app.listen(3000);
