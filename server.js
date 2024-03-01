import { Server } from "socket.io";
import express from "express";

const app = express();

const server = app.listen(5000, () => {
    console.log("Server is running on port 5000");
    }
);

const io = new Server(server, {
    cors:true,
});

const userToSocket = new Map();
const socketToUser = new Map();

io.on("connection", (socket) => {
    console.log("New user connected");
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });

    socket.on("join-room", (roomId, userId) => {
        userToSocket.set(userId, socket.id);
        socketToUser.set(socket.id, userId);
        socket.broadcast.to(roomId).emit("user-joined", {
            roomId,
            userId,
        });
        socket.join(roomId);
        io.to(socket.id).emit("room-joined",{
            userId,
            roomId
        });
       
    });
});

