var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = [];

//使用www文件夹作为视图层的目录
app.use('/', express.static(__dirname + '/www'));

server.listen(process.env.PORT || 3000);

//socket.io的使用
io.sockets.on('connection', function(socket) {
    //当新用户连接的时候
    socket.on('login', function(nickname) {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname, users.length, 'login');
        };
    });
    //当有用户离开时
    socket.on('disconnect', function() {
        users.splice(socket.userIndex, 1);
        socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
    });
    //当用户发送信息
    socket.on('postMsg', function(msg, color) {
        socket.broadcast.emit('newMsg', socket.nickname, msg, color);
    });
    //用户发送图片
    socket.on('img', function(imgData, color) {
        socket.broadcast.emit('newImg', socket.nickname, imgData, color);
    });
//-------------------------------------------------------------
    io.sockets.sockets[socket.id].emit('Hello', socket.id);
    
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });
    
    socket.on('control', function(msg) {
        var tmp=msg.split("=");
        io.sockets.sockets[tmp[0]].emit('control', tmp[1]+"="+tmp[2]+"="+tmp[3]);
    });
    
    socket.on('pongControl', function(msg) {
        var tmp=msg.split("=");
        console.log(tmp[1]+"="+tmp[2]+"="+tmp[3]+"="+tmp[4])
        io.sockets.sockets[tmp[0]].emit('pongControl', tmp[1]+"="+tmp[2]+"="+tmp[3]+"="+tmp[4]);
    });

});