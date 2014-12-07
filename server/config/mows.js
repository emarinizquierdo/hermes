/**
 * mows configuration
 */

'use strict';

var loriini = require('../components/loriini');

module.exports = function(server, mows) {

    // Create an unsecure MQTT websocket server
    var unsecureServer = mows.attachServer(server, loriini.clientHandler);

    console.log('Listening for MQTT websocket connections on ports 666 (secure) and 665 (unsecure)');

};
