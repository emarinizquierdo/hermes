/**
 * mows configuration
 */

'use strict';
var _ = require('lodash');
var Device = require('../api/device/device.model');
var self = this || {};

module.exports = {

    clientHandler: function(client) {

        

        if (!self.clients) self.clients = {};

        client.on('connect', function(packet) {

            var _clientID = packet.clientId;

            Device.find({clientID : _clientID.replace("loriini", "") }, function(err, device) {

                if (err) {
                    console.log('Error trying connect');
                    client.disconnect();
                    return;
                }
                if (!device || device.length == 0) {
                    console.log("Doesn't exist this client");
                    client.disconnect();
                    return;
                }

                console.log('Connected');
                
                client.connack({
                    returnCode: 0
                });

                client.id = _clientID;
                self.clients[client.id] = client;

            });            
            
        });

        client.on('publish', function(packet) {
            console.log('Publish');
            for (var k in self.clients) {
                self.clients[k].publish({
                    topic: packet.topic,
                    payload: packet.payload
                });
            }
        });

        client.on('subscribe', function(packet) {
            var granted = [];
            for (var i = 0; i < packet.subscriptions.length; i++) {
                granted.push(packet.subscriptions[i].qos);
            }

            client.suback({
                granted: granted,
                messageId: packet.messageId
            });
        });

        client.on('pingreq', function(packet) {
            client.pingresp();
        });

        client.on('disconnect', function(packet) {
            console.log('disconnect')
            client.stream.end();
        });

        client.on('close', function(err) {
            delete self.clients[client.id];
        });

        client.on('error', function(err) {
            client.stream.end();
            console.log('error!');
        });

    }

}
