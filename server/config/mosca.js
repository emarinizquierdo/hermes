/**
 * mosca configuration
 */

'use strict';

module.exports = function(server, mosca) {

    var moscaSettings = {
        port: 1833,
    };

    var moscaserver = new mosca.Server({});
    moscaserver.on('ready', setup);

    moscaserver.on('clientConnected', function(client) {
        console.log('client connected', client.id);
    });

    // fired when a message is received
    moscaserver.on('published', function(packet, client) {
        console.log('Published', packet.payload);
    });

    moscaserver.attachHttpServer(server);

    // fired when the mqtt server is ready
    function setup(p) {
        console.log(p);
        console.log('Mosca server is up and running')
    }


};
