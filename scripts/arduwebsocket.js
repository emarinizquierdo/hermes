
var webSocketServer = require('websocket').server;

var  clients = [];

exports.Handler = function(p_server ){  
  
  wsServer = new webSocketServer({httpServer:p_server, keepalive:false});
  
  wsServer.on('request', function(request){
    
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
    var connection = request.accept(null, request.origin);
    var index = clients.push(connection) - 1;
    console.log((new Date()) + ' Connection accepted.');
    
    connection.on('message', function(message){
      if (message.type === 'utf8') { // accept only text
        //get data object from message         
  		    var data = message.utf8Data;
      }
      console.log('message received: ' + data);
      connection.sendUTF(data);
    });
    
    connection.on('close', function(connection){
      console.log('connection closed');
    });
    
  });
}

exports.SendMessage = function( p_message ){
  
  console.log("Sending: " + escapeHtml(p_message));
  for (var i=0; i < clients.length; i++) {
    clients[i].sendUTF( p_message );
  }
  
}
  
