/**
 * mosca configuration
 */

'use strict';

var _ = require('lodash');
var Device = require('../api/device/device.model');
var self = this || {};

module.exports = function(server, mosca) {

	if (!self.clients) self.clients = {};

    var moscaSettings = {
        port: 1833,
    };

    var moscaserver = new mosca.Server({});
    moscaserver.on('ready', setup);

    moscaserver.on('clientConnected', function(client) {
        console.log("llegando paquete de conexion: ", client.id);
/*
            var _clientID = client.id;

            Device.find({
                clientID: _clientID.replace("loriini", "")
            }, function(err, device) {

                if (err) {
                    console.log('Error trying connect');
                    return;
                }
                if (!device || device.length == 0) {
                	console.log(client);
                    console.log("Doesn't exist this client");
                    return;
                }

                console.log('Connected');

                client.id = _clientID;
                self.clients[client.id] = client;

            });
*/
    });
/*
    moscaserver.on('published', function(packet) {
        console.log('Publish');
        for (var k in self.clients) {
            self.clients[k].publish({
                topic: packet.topic,
                payload: packet.payload
            });
        }
    });
*/
    moscaserver.attachHttpServer(server);

    // fired when the mqtt server is ready
    function setup(p) {
        console.log(p);
        console.log('Mosca server is up and running')
    }


};
