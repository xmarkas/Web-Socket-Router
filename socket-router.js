// Web socket
let WebSocket = require('ws');

// Instance of the Web Socket Server
let socketServer = new WebSocket.Server({ port: 4001 });

// Methods for the router to call
let socketMethods = {};

/**
* From the client pass an object with 2 keys: method and data
*   { method: "someMethod", data: {a: "someValue", b: "someValue"} }
*   
*  The object must be a string, so use JSON.stringify(yourObject) before
*  sending it to the server.
*
*   The value of the data key will be send to the method when it is called.
*/
socketServer.on("connection", function (ws, req) {
    ws.on('message', (data) => {
        data = JSON.parse(data);
        
        // If the method exists send it to the socket routing function
        if (Object.keys(socketMethods).includes(data.method)) {
            socketRouter(data, ws);
        }
    })

    ws.on('close', function (err) {
        console.log('  ! Client Disconnected ! ');
    });
})

/**
* The socketRouter looks up the method and calls it passing in the data
* from the client as the first argument, and the socket connection of 
* the client.
*/
function socketRouter(data, ws) {
    let method = data.method;
    socketMethods[method](data.data, ws);
}

/**
* Add new methods to the socketMethods object. 
*
* If there is a method called "registerSocket", and the client passess
* the value for method as { method: "registerSocket"} the following method
* will be called.
*/
socketMethods.registerSocket = (data, ws) => {
  console.log("The socket is registered");
  
  // Reply back to the client 
  ws.send(JSON.stringify({
      method: "socketConfirmed",
      data: {success:true}
     }));
     
 }
     
