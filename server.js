// jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
// const favicon = require("serve-favicon");

const app = express();

const PORT = process.env.PORT || 3000;  //simply use 'or' than if else
const mongoose = require("mongoose");
const session = require("express-session");
const flash =  require("express-flash");
const MongoDbStore = require("connect-mongo"); // notice 'M'
const passport = require("passport");
const Emitter = require("events");


// Favicon
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


// Database connection
mongoose.connect("mongodb://localhost:27017/Nursery");
mongoose.connection.once("open", ()=> {
    console.log("Database Connected");
}).on("error", ()=> {
    console.log("Connection Failed");
});


// Event emitter
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);   // bind with app, so that can be used frm anywhere


// Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        mongoUrl: "mongodb://localhost:27017/Nursery"
    }),
    saveUninitialized: false,
    cookie: {maxAge: 1000*60*60*24}    // 24 hours (in milliseconds)
}));



// Passport config
const passportInit = require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());



app.use(flash());

// Assets
app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());


// Global middleware
app.use((req, res, next)=> {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next(); // otherwise url will not work
});


// Set tempelate engine
app.use(expressLayout);

app.set("views", path.join(__dirname, "resources/views"));
app.set("view engine", "ejs");


require("./routes/web")(app);


const server = app.listen(PORT, ()=>{
                // console.log("Server is running on port 3000!");
                console.log(`Server is running on port ${PORT}!`);
            });

// Socket
const io = require("socket.io")(server);
io.on("connection", (socket) => {
    // unique rooms as if one order status changes, then only that orderid status will change => so orderid
    // console.log(socket.id);
    // Join
    socket.on("join", (roomName) => {
        // console.log(roomName);
        socket.join(roomName);
    });
});

eventEmitter.on("orderUpdated", (data) => {
    // console.log(data);
    io.to(`order_${data.id}`).emit("orderUpdated", data);
});

eventEmitter.on("orderPlaced", (data) => {
    io.to("adminRoom").emit("orderPlaced", data);
});