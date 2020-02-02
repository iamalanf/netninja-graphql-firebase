const functions = require('firebase-functions');
const admin = require('firebase-admin');
const myServer = require('./express-graphql/app');

const app = require('./express-graphql/app');

exports.graphiql = functions.https.onRequest(app);