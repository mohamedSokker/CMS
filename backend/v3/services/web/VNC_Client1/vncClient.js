const VncClient = require("../VNC_Client1/vncmodules/vncclient");
const { handleConnect } = require("./handleConnection");

const initOptions = {
  debug: false, // Set debug logging
  encodings: [
    // Encodings sent to server, in order of preference
    VncClient.consts.encodings.copyRect,
    VncClient.consts.encodings.zrle,
    VncClient.consts.encodings.hextile,
    VncClient.consts.encodings.raw,
    // VncClient.consts.encodings.pseudoDesktopSize,
    // VncClient.consts.encodings.pseudoCursor,
  ],
  debugLevel: 1, // Verbosity level (1 - 5) when debug is set to true
};

const client = new VncClient(initOptions);
let count = 0;

const addConndection = async (socket, port, portsCreated, io) => {
  try {
    const connectionOptions = {
      host: "127.0.0.1", // VNC Server
      // password: "", // Password
      set8BitColor: false, // If set to true, client will request 8 bit color, only supported with Raw encoding
      port: port, // Remote server port
    };
    console.log(portsCreated, port);
    // console.log(client._connected);
    if (portsCreated.includes(port)) return;
    client.connect(connectionOptions);
    setTimeout(() => {
      if (client._connected) portsCreated.push(port);
    }, 5000);

    // console.log(portsCreated, port);
    // portsCreated.push(port);
    // console.log(portsCreated, port);

    if (count === 0) handleConnect(client, io, port, portsCreated);
    count++;
    // setInterval(() => {
    //   if (!client.connected) client.connect(connectionOptions);
    // }, 1000);
    client.changeFps(10);
  } catch (error) {
    console.log(`Error in client connection: ${error}`);
  }
};

module.exports = { addConndection, client };
