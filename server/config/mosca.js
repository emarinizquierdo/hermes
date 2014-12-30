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
    });

    moscaserver.on('published', function(packet) {
        console.log('Publish', packet.payload);
    });

    moscaserver.on('error', function(err) {
        console.log('error!', err);

        
    });

    moscaserver.attachHttpServer(server);

    // fired when the mqtt server is ready
    function setup(p) {
        console.log(p);
        console.log('Mosca server is up and running')
    }


};
