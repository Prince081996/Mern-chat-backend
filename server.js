const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cors = require("cors");
const app = express();
const path = require("path");
app.use(cors());
dotenv.config();
app.use(express.json()); // to accespt json data
connectDB();
const { chats } = require("./data/data");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

app.get("/", (req, res) => {
  res.send("Api is running");
});

app.get("/api/chats", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  //   console.log(req.params.id);
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ------------------Deployment--------------------
const __dirname1 = path.resolve();
// if (process.env.NODE_ENV === "production") {
app.use(express.static(path.join(__dirname1, "/frontend/talk/build")));
app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname1, "frontend/talk", "build", "index.html")
  );
});
// } else {
//   app.get("/", (req, res) => {
//     res.send("Api is running succesfully");
//   });
// }

// ------------------Deployment--------------------
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`Server is listening on port ${PORT}`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  // console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat?.users?.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      console.log(user._id);
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("calling",(selectedChat) => {
    const loggedInUser = selectedChat?.loggedInUser
    console.log(loggedInUser,"users",selectedChat)
     selectedChat.users?.forEach((user) => {
      if(user._id !== loggedInUser._id)          return
    socket.in(user._id).emit("calling received",loggedInUser)
    })
  })
});
