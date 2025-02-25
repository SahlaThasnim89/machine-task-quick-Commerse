const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
// const port=process.env.PORT
const port=3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
const httpServer = createServer(handler);
const io = new Server(httpServer);

app.prepare().then(() => {
  io.on("connection", (socket) => {
    console.log("🟡 socket is connected ");

    socket.on("joinRoom", (id) => {
      console.log(id,"id")
      socket.join(id); // Join a room based on order ID
    });

    socket.on("orderStatusChange",value=>{
      console.log("it happend")
      if(!value?.userId || !value.status) return null
      console.log(value.userId,"userID on order upadetd")
        io.in(value.userId).emit("orderUpdated","order updated to "+value.status)
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.log(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

module.exports = { io };
