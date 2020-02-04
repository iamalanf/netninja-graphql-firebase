const functions = require('firebase-functions');
const app = require("./expressServer/app");

// const server = gqlServer();

exports.graphiql = functions.https.onRequest(app);

// exports.graphiql = functions.https.onRequest(gqlServer);