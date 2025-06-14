const setupMaintAppHandlers = (io, socket, users) => {
  io.emit("userID", {
    id: socket.id,
    appVersion: 6,
    sparePartAppVersion: 2,
  });

  socket.on("userName", (data) => {
    console.log(`New Connection ${data} => ${socket.id}`);
    users = { ...users, [socket.id]: data };
    console.log(users);
  });

  socket.on("scanned", (data) => {
    console.log("socket scanned => checkScan");
    io.to(data.split("==")[1]).emit("checkScan", data);
  });

  socket.on("successScan", (data1) => {
    console.log("socket successScan => confirmScan");
    io.to(data1?.data?.split("==")[0]).emit("confirmScan", data1);
  });

  socket.on("updateAppData", (data) => {
    console.log("socket updateAppData => appDataUpdate");
    io.broadcast.emit("appDataUpdate", data);
  });

  socket.on("appNewMaint", (data) => {
    console.log("socket appNewMaint => appNewMessage");
    io.broadcast.emit("appNewMessage", data);
  });

  socket.on("appFinishedMaint", (data) => {
    io.broadcast.emit("appFinishedMessage", data);
  });
};

module.exports = { setupMaintAppHandlers };
