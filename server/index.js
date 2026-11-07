const {Server}= require("socket.io");

const server=8000;

const io= new Server(server);

io.on("connection", (socket)=>{
    console.log(`Socket Connected`,socket.id);
})