import { io } from "socket.io-client";

const URL = "http://localhost:3333"

export const socketIo = io(URL, {
    autoConnect: false
  });