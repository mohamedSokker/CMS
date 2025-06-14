const socketio = require("socket.io");

const { setupMaintAppHandlers } = require("./MaintAppHandler");
const { setupVNCHandlers } = require("./VNCHandler");
const { setupSparepartsHandlers } = require("./SparepartAppHandler");

const { client } = require("../services/web/VNC_Client1/vncClient");
const {
  handleDisconnect,
} = require("../services/web/VNC_Client1/handleConnection");

// const { availability } = require("../controllers/web/Dashboard/availability");

let portsCreated = [];

let io;

const socketFn = (server) => {
  let users = {};
  let rooms = {};

  io = socketio(server, {
    cors: {
      origin: "*",
    },
  });

  const disconnectHandle = (socket, io) => {
    delete rooms[socket?.id];
    delete users[socket?.id];
    console.log(rooms);
    if (Object.keys(rooms).length === 0) {
      console.log(client._connected);
      portsCreated = [];
      handleDisconnect(client, io, 8000, []);
      if (client._connected) client.resetState();
      console.log("Disconnected", client._connected);
    }
  };

  io.on("connection", (socket) => {
    console.log(`New Connection ${socket.id}`);

    socket.emit("RequestUserName", "RequestUserName");

    setupVNCHandlers(io, socket, rooms, portsCreated);

    setupMaintAppHandlers(io, socket, users);

    setupSparepartsHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`${users[socket?.id]} Connection Lost`);
      disconnectHandle(socket, io);
    });
  });
};

module.exports = { socketFn, io };
