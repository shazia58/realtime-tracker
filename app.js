const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

// ✅ Set EJS as view engine and fix views path
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Serve static files (CSS, JS, images) from /public
app.use(express.static(path.join(__dirname, "public")));

// ✅ Socket.io setup
io.on("connection", function (socket) {
  console.log("New user connected:", socket.id);

  socket.on("send-location", function (data) {
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", function () {
    io.emit("User-disconnected", socket.id);
  });
});

// ✅ Routes
app.get("/", function (req, res) {
  res.render("index"); // loads views/index.ejs
});

app.get("/favicon.ico", (req, res) => res.status(204));

// ✅ Dynamic PORT for Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
