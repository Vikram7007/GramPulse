const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// ✅ CORS OPTIONS
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// ✅ SOCKET.IO – SINGLE SOURCE OF TRUTH
global.io = new Server(server, {
  cors: corsOptions,
});

// ✅ SOCKET HANDLERS (CALL ONLY ONCE)
require('./sockets/socket')(global.io);

// ✅ DB CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ DB Error:', err));

// ✅ ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/issues', require('./routes/issues'));

// ✅ SERVER START
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Frontend URL: http://localhost:5173`);
});
