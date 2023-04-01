const express = require('express')
const app = express()
const serv = require('http').Server(app)
const io = require('socket.io')(serv,{})

const socketList = {}

// app.get('/', (req, res) => {
// 	res.sendFile(__dirname + '/client/index.html')
// })

// app.use('/client', express.static(__dirname + '/client'))

serv.listen(3000)
console.log("Server started")

io.sockets.on('connection', (socket) => {

	console.log('client#' + socket.id + ' connected')

	socket.on('client.ping', () => {
		console.log('client#' + socket.id + ' disconnected')
        socket.emit('server.pong');
    })
})