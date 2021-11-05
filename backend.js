const app = require("express")();
const https = require('https')

const httpServer = require("https").createServer(credentials, app);
const options = {
    cors: {
        origin: '*',
    }
};
const io = require("socket.io")(httpServer, options);

const fs = require('fs')
const rooms_f = './backend/rooms.json'
const rooms = require(rooms_f)

io.on("connection", socket => { 
    socket.join('user' + socket.handshake.auth.uid)
    socket.on('req', (...args) => {
        if(args[0].type == 'create_room'){
            socket.join('room' + socket.handshake.auth.uid)
            if(rooms[socket.handshake.auth.uid]){
                socket.emit('res',{
                    type:'connectRoom',
                    data:rooms[socket.handshake.auth.uid]
                })
            } else {
                rooms[socket.handshake.auth.uid] = {
                    owner:socket.handshake.auth.uid,
                    config:{
                        btns: [1, 0, 1, 0, 1, 0, 1, 0],
                        play: true,
                        currentButton: 0
                    }
                } 
                fs.writeFileSync(rooms_f, JSON.stringify(rooms))
                socket.emit('res',{
                    type:'connectRoom',
                    data:rooms[socket.handshake.auth.uid]
                })
            }
        }
        if(args[0].type == 'update_config'){
            if(!rooms[socket.handshake.auth.uid]){
                socket.emit('res', {
                    type:'roomClose'
                })
            } else {
                rooms[socket.handshake.auth.uid].config = args[0].payload
                fs.writeFileSync(rooms_f, JSON.stringify(rooms))
                socket.to('room' + socket.handshake.auth.uid).emit('res', {
                    type:'updateConfig',
                    data:rooms[socket.handshake.auth.uid].config
                })
            }
        }
        if(args[0].type == 'leaveRoom'){
            socket.leave('room' + args[0].room_id)
            socket.emit('res', {
                type:'roomClose'
            })
        }
        if(args[0].type == 'connectRoom'){
            if(rooms[args[0].room_id]){
                socket.join('room' + args[0].room_id)
                socket.emit('res',{
                    type:'connectRoom',
                    data:rooms[args[0].room_id]
                })
            } else {
                socket.emit('res', {
                    type:'roomClose'
                })
            }
        }
    })
 });

httpServer.listen(3000, () => console.log("LISTEN 3000"));

setInterval(async() => {
    for(let i in rooms){
        console.log(i)
        console.log(rooms[i])
        if(rooms[i].config.currentButton == 7){
            rooms[i].config.currentButton = 0
            io.to('room' + i).emit('res', {
                type:'updateConfig',
                data:rooms[i].config
            })
        } else {
            rooms[i].config.currentButton += 1
            io.to('room' + i).emit('res', {
                type:'updateConfig',
                data:rooms[i].config
            })
        }
    }
}, 1000)