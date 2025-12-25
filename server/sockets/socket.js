module.exports = (io) => {
  console.log('🔥 socket.js LOADED');

  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    socket.on('joinGramSevak', (name) => {
      console.log('🔥 joinGramSevak RECEIVED:', name);

      const room = `gramsevak:${name.trim().toLowerCase()}`;
      socket.join(room);

      console.log('✅ Joined room:', room);
    });
  });
};
