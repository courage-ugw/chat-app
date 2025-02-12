const express = require('express');
const { createServer } = require('node:http');
const path = require('path');
const socketio = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath)); 


io.on('connection', (socket) => {
    console.log('New webSocket connection');
    
    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room });

        if (error) {
            return callback(error);
        }
        socket.join(user.room) // this sets the room for when a user joins
        socket.emit('sendMessage', generateMessage('Admin', 'Welcome!'));
        socket.broadcast.to(user.room).emit('sendMessage', generateMessage(`${user.username} has joined!`));

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });

        callback();
    });

    socket.on('sendMessage', (message, callback) =>{
        const user = getUser(socket.id);

        // if (filter.isProfane(message)) {
        //     return callback('Profanity is not allowed!');
        // }

        io.to(user.room).emit('sendMessage', generateMessage(user.username, message));
        callback('delivered!');
    });

    socket.on('sendLocation', (position, callback) => {
        const user = getUser(socket.id);

        const location = { lat: position.coords.latitude, long: position.coords.longitude}
        const url = `https://google.com/maps?q=${location.lat},${location.long}`;

        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username, url));
        callback('Location shared!');
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('sendMessage', generateMessage('Admin', `${user.username} has left`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });
});

server.listen(port, () => {
    console.log(`server is running on port ${port}!`);
});