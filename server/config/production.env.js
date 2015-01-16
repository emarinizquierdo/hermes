'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN: 'http://hermesiot.ddns.net',
  SESSION_SECRET: "hermes-secret",

  GOOGLE_ID: '536470903952-uit2nvn0qk34ijn26dalnb307jm3i0ii.apps.googleusercontent.com',
  GOOGLE_SECRET: 'RbP_AT9lQwckLyUGpF9gL6UF',

  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
