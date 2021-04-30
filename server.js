const PORT = process.env.PORT || 5000;

const io = require("socket.io")(PORT, {
  cors: {
    origin: process.env.CLIENT_PORT || "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  const id = socket.handshake.query.userId;
  socket.join(id);
  console.log("connected", id);

  socket.on("send-message", ({ recepients, text }) => {
    console.log("Text", text);
    io.emit("all", "bro");
    console.log(recepients, text);
    io.to(recepients[0]).emit("for_id", "for your eyes only");
    recepients.forEach((recepient) => {
      const newRecepients = recepients.filter((r) => r !== recepient);
      newRecepients.push(id);
      io.to(recepient).emit("receive-message", {
        recepients: newRecepients,
        sender: id,
        text,
      });
    });
  });
});
