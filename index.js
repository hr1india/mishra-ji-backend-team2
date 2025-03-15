const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const trackingRoutes = require("./routes/trackingRoutes");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/tracking", trackingRoutes);

// WebSocket connection for real-time tracking
io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.on("send-location", (data) => {
    console.log("Received location:", data);
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
    io.emit("disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require('./routes/orderRoutes.js')

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Test Route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Routes
app.use("/api/products", productRoutes);
app.use('/api/orders', orderRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
