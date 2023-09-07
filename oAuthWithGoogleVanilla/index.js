const http = require('http');
const app = require('./app.js');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

const httpServer = http.createServer(app);

async function startServer() {
  httpServer.listen(PORT, () => { 
    console.log(' server is listning on ', PORT);
  });
}

startServer();