
var webSocketServer = require('websocket').server;

exports.Handler = function(p_server ){
  
  var wsServer = new webSocketServer({httpServer:p_server});
  
  wsServer.on('request', function(request){
    
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
    var connection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection accepted.');
    
    connection.on('message', function(message){
      if (message.type === 'utf8') { // accept only text
        //get data object from message         
  		    var data = message.utf8Data;
      }
      console.log('message received: '+data);
      connection.sendUTF(data);
    });
    
    connection.on('close', function(connection){
      console.log('connection closed');
    });
    
  });
}
  