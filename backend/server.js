const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();

// converts an express app into an server
const server = http.createServer(app);

// initializes a websocket server using socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

// it runs whenever the user connects with the server via websocket
io.on("connection", (socket) => {
    console.log("A user connected: ", socket.id);

    // Join a specific chat room
    socket.on("join_room", ({ senderEmail, receiverEmail }) => {
        const room = [senderEmail, receiverEmail].sort().join("_");
        socket.join(room);
        console.log(`${senderEmail} joined room: ${room}`);
    });

    // handle incoming messages
    socket.on("send_message", (data) => {
        const room = [data.sender, data.receiver].sort().join("_");
        console.log(`Sending message from ${data.sender} to ${data.receiver}`);
        io.to(room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(5000, () => {
    console.log(`Server Running on PORT 5000`);
});

// Rooms are virtual spaces where clients(users) can join and exchage message privately.
// They are used to seperate different conversations, ensuring that messages are send to the intended participants only.

// Users in the same room can send and receive messages among themselves, while users outside the room cannot hear the conversations.
// Note 1: Rooms do not have to be created manually- they are automatically created when a socket joins a room.
// Note 2: A single socket can join multiple rooms
// Note 3: You can send message to a single room instead of broadcasting to all the users.

// 1. socket.on(event,callback)-> this method listens for the events emitted by the client or server
// 2. socket.off(event, callback)-> this method removes the event listener to prevent memory leaks or stop listening for an specific event
// 3. socket.emit(event, data)-> this method sents data from client to server or vice-versa
// 4. socket.join(roomName)-> adds a user to a specific room so they can communicate
// 5. socket.leave(roomName)-> removes a user from the specific room
// 6. socket.to(roomName).emit(event,data)-> sends a message only to users inside a specific room
// 7. io.to(roomName).emit(event,data)-> similar to socket.to(), but sends a message to all sockets in a room from the server
// 8. io.emit()-> this method broadcast an event to all the connected clients.
// 9. socket.disconnect()-> this method disconnects a client from the server
