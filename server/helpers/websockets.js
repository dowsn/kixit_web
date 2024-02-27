import { server as WebSocketServer } from 'websocket';
import { checkAllPlayersReady } from './playFunctions.js';

// Create a connection manager
export const connections = new Map();

export function getConnection(id) {
  return connections.get(id);
}

export default function setupWebSocketServer(server) {
  // Create WebSocket server
  const wsServer = new WebSocketServer({
    httpServer: server,
  });

wsServer.on('request', function (request) {
  const connection = request.accept(null, request.origin);
  let playerId; // Declare playerId here so it can be accessed in the 'close' event handler

  connection.on('message', async function (message) {
    if (message.type === 'utf8') {
      const dataFromClient = JSON.parse(message.utf8Data);

      // Store the connection using the playerId as the key
      if (dataFromClient.playerId) {
        playerId = dataFromClient.playerId; // Store playerId

        // what does this do? Should I also add here gameID
        connections.set(playerId, connection);
      }




      if (dataFromClient.type === 'WAITING_ROOM') {
        let allPlayersReady = await checkAllPlayersReady(
          dataFromClient.gameId,
          dataFromClient.playerId,
        );


        var response;
        if (allPlayersReady) {
          // send to all
          response = JSON.stringify({ message: 'All players are ready!', type: 'WAITING_ROOM', ready: true });

        } else {

          response = JSON.stringify({
            message: 'Waiting for other players to join...',
            type: 'WAITING_ROOM',
            ready: false
          });

}
  connections.forEach((conn) => {
    conn.sendUTF(response);
  })
      }


      if (dataFromClient.type === 'NEXT_ROUND') {

        // posun
         let allPlayersReady = await checkAllPlayersReady(
           dataFromClient.gameId,
           dataFromClient.playerId,
         );

         var response;
         if (allPlayersReady) {
           // send to all
           response = JSON.stringify({
             message: 'All players are ready!',
             type: 'WAITING_ROOM',
             ready: true,
           });
         } else {
           response = JSON.stringify({
             message: 'Waiting for other players to join...',
             type: 'WAITING_ROOM',
             ready: false,
           });
         }
         connections.forEach((conn) => {
           conn.sendUTF(response);
         });
       }






    }
  });







    connection.on('close', function (reasonCode, description) {
      console.log('Client has disconnected.');

      // Remove the connection from the manager when it's closed
      if (playerId) {
        connections.delete(playerId); // Remove the connection when it's closed

                  response = JSON.stringify({
                    message: 'Waiting for other players to join...',
                    type: 'WAITING_ROOM',
                    ready: false,
                  });

          connections.forEach((conn) => {
            conn.sendUTF(response);
          });


      }
    });
});

}
