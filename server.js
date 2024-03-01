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
        
        socket.on("user:call", (data) => {  
            const {to, offer} = data;
            io.to(to).emit("incoming:call", {from:socket.id, offer});
        });

        socket.on("call:accepted", ({to,ans}) => {
            io.to(to).emit("call-accepted", {from:socket.id,offer:ans});
        });

        socket.on("peer:nego:needed", (data) => {
            const {offer} = data;
            io.to(data.to).emit("peer:nego:needed", {from:socket.id, offer});
        });

        socket.on("peer:nego:done", (data) => {
            const {ans} = data;
            io.to(data.to).emit("peer:nego:final", {from:socket.id, ans});
        });
    });

});

