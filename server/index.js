const { Server } = require("socket.io");

const port = Number(process.env.PORT) || 8000;
const io = new Server(port, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log("Socket Connected", socket.id);

  socket.on("room:join", (data) => {
    const { email, room } = data;

    console.log(data);
// whenervr a user enters it will run i bknd
    emailToSocketIdMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);

     io.to(room).emit("user:joined", { email, id: socket.id });// it will send to all users in that room that a new user has joined,,,need to add an event listener

    socket.join(room);//pehle new user ko roompejoin kraenge but before it u need to emit tht new user has joined
    io.to(socket.id).emit("room:join", { email, room });
  });
});

console.log(`Socket server running on port ${port}`);