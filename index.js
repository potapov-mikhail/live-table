const http = require('http');
const express = require('express');
const WebSocketServer = require('websocket').server;

const PORT = process.env.PORT || 3000;

const clients = [];

function createApp() {
  const app = express();

  const server = http.createServer(app);
  app.use(express.static(__dirname + '/public'));

  const wss = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
  });

  wss.on('request', req => {

    const connection = req.accept('', req.origin);
    clients.push(connection);
    console.log('Connected' + connection.remoteAddress);

    connection.on('message', msg => {
      const dataName = `${msg.type}Data`;
      const data = msg[dataName];

      clients.forEach(client => {
        if (connection !== client) {
          client.send(data);
        }
      });

    });

    connection.on('close', (reasonCode, description) => {
      console.log('Disconnected' + connection.remoteAddress);
      console.dir({ reasonCode, description })
    });

  });

  return server;
}


if (!module.parent) {
  const app = createApp();
  app.listen(PORT, () => console.log(`Server start on PORT=${PORT}; PID=${process.pid}`));
}

