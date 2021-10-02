// jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");

const app = express();

const PORT = process.env.PORT || 3000;  //simply use 'or' than if else


app.get("/", (req, res)=>{
    res.render("home");
});

// Set tempelate engine
app.use(expressLayout);

app.set("views", path.join(__dirname, "resources/views"));
app.set("view engine", "ejs");

app.listen(PORT, ()=>{
    // console.log("Server is running on port 3000!");
    console.log(`Server is running on port ${PORT}!`);
});

