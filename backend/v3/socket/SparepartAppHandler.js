const setupSparepartsHandlers = (io, socket) => {
  socket.on("TaskEdited", (data) => {
    console.log(data);
    io.broadcast.emit("UpdateTask", data);
  });
};

module.exports = { setupSparepartsHandlers };
