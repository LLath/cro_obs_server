import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer((req, res) => {
  if (req.url === "/") {
    res.write("This is a test");
    res.end;
  }
});
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:2833",
      "http://127.0.0.1:2833",
      "https://llath.github.io/cro_obs_sources/control",
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);

  socket.on("update:saved", (data) => {
    console.log("update received", data);
    io.sockets.emit("update:overlay", data);
  });
  socket.on("page:change", (value) => {
    console.log("page:change received", value);
    io.sockets.emit("page:change:trigger", value);
  });
});

io.on("disconnect", () => {
  console.log("Client disconnected");
});

httpServer.listen(2533, () => {
  console.log("Server running on 2533");
});
