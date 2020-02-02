const functions = require('firebase-functions');

const app = require('./express-graphql/app');

exports.graphiql = functions.https.onRequest(app);