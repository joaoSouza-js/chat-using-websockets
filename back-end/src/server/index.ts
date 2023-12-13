import express from "express"
import socketio from "socket.io"
import http from "http" 
import cors from "cors"

const app = express()

app.use(cors({
    origin: "*"
}))

const port = 3333

const  ApiServer = http.createServer(app)
const SocketServer = new socketio.Server(ApiServer,{
    cors:{
        origin: "*"
    },
    
})

SocketServer.on('connection', socket => {
    console.log("socketId =>", socket.id)
    
    socket.on("message", data => {
        const message: string = data
        console.log("data:", message)
        socket?.emit("message", message)
    })
})


ApiServer.listen(port, () => {
    console.log(`i running on port http://localhost/${port}`)
} )