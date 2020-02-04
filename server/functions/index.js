const functions = require("firebase-functions");
const app = require("./express-graphql/app");

exports.graphiqlExpressGraphql = functions.https.onRequest(app);
