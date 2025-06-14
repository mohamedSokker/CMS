const {
  addConndection,
  client,
} = require("../services/web/VNC_Client1/vncClient");

const {
  handleDisconnect,
} = require("../services/web/VNC_Client1/handleConnection");

const setupVNCHandlers = (io, socket, rooms, portsCreated) => {
  socket.on("join-message", async (roomId) => {
    console.log("join-message triggered");
    socket.join(roomId);
    rooms = { ...rooms, [socket.id]: roomId };
    console.log(rooms);
    const port = Number(roomId);
    await addConndection(socket, port, portsCreated, io);
  });

  socket.on("type", function (data) {
    var room = JSON.parse(data).room;
    socket.broadcast.to(room).emit("type", data);
  });

  // socket.on("requestAvData", async () => {
  //   await availability(io);
  // });

  socket.on("leave-room", (roomId) => {
    delete rooms[socket?.id];
    if (Object.keys(rooms).length === 0) {
      console.log(client._connected);
      portsCreated = [];
      handleDisconnect(client, io, 8000, portsCreated);
      if (client._connected) client.resetState();
      console.log("Disconnected", client._connected);
    }
    socket.leave(roomId);
  });
};

module.exports = { setupVNCHandlers };
