const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = 3000;

app.use(express.static('public'));

const passwords = {
    us: 'eagle123',
    iraq: 'scorpion321'
};

let gameState = {
    us: [],
    iraq: []
};

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('join', ({ side, password }) => {
        if (passwords[side] === password) {
            socket.join(side);
            socket.emit('authorized', { side, state: gameState[side] });
        } else {
            socket.emit('unauthorized');
        }
    });

    socket.on('updateTroops', ({ side, units }) => {
        gameState[side] = units;
        socket.to(side).emit('updateTroops', units);
    });
});

http.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
