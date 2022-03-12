const express = require("express");
const cookieParser = require("cookie-parser");
const port = 8000;
const path = require("path");
const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

const db = require("./config/mongoose");
const User = require("./models/user");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("assets"));
app.use(cookieParser());



// Socket for Chat
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });


io.on("connection", (socket) => {
  socket.on("message", (data) => {
    socket.broadcast.emit("message", data);
  });
});


app.get("/", function (req, res) {
  return res.render("home");
});


app.get("/sign-in", function (req, res) {
  return res.render("signIn");
});


app.get("/sign-up", function (req, res) {
  return res.render("signUp");
});


app.get("/Signups/sign-in", function (req, res) {
  User.findOne(
    {
      email: req.query.email,
    },
    function (err, user) {
      if (err) {
        console.log("error in finding the user");
        return;
      }
      if (user) {
        if (user.password != req.query.password) {
          return res.redirect("back");
        }
        return res.redirect("/Signups/chat-box");
      } else {
        return res.redirect("back");
      }
    }
  );
});

// User's Sign Up page
app.post("/Signups/sign-up", function (req, res) {
  if (req.body.password != req.body.confirmPassword) {
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding the user in signup");
      return;
    }
    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("error in creating the user while signing up");
          return;
        }
        return res.redirect("/sign-in");
      });
    } else {
      return res.redirect("back");
    }
  });
});

// Chatting Window
app.get("/Signups/chat-box", function (req, res) {
  return res.render("chat_box");
});

server.listen(port, function (err) {
  if (err) {
    console.log("error in running the server", err);
  }
  console.log("My express server is running on the port:", port);
});
