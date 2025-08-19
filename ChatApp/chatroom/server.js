const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = 3000;

// Serve static files (index.html, code.js, etc.)
app.use(express.static(__dirname + "/public"));

// Handle socket connections
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("newuser", (username) => {
        socket.username = username;
        socket.broadcast.emit("update", `${username} joined the conversation`);
    });

    socket.on("chat", (message) => {
        socket.broadcast.emit("chat", message);
    });

    socket.on("exituser", (username) => {
        socket.broadcast.emit("update", `${username} left the conversation`);
        console.log(`${username} disconnected`);
    });

    socket.on("disconnect", () => {
        if (socket.username) {
            socket.broadcast.emit("update", `${socket.username} left the chat`);
        }
    });
});

http.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
