const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const resolvers = require('./resolvers');
const typeDefs = require('./schema');

// https://www.apollographql.com/docs/apollo-server/v1/servers/express/

// const gqlServer = () => {
const app = express();

const apolloServer = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    introspection: true,
    playground: true,
});

apolloServer.applyMiddleware({app, path: '/', cors: true});

    // return app;
// }

module.exports = app;

// const express = require('express');
// const bodyParser = require('body-parser');
// const { graphqlExpress } = require('apollo-server-express');

// const resolvers = require('./resolvers');
// const typeDefs = require('./schema');

// // https://www.apollographql.com/docs/apollo-server/v1/servers/express/

// const app = express();

// app.use(
//     "/",
//     bodyParser.json(),
//     graphqlExpress({
//         schema: typeDefs,
//         resolvers: resolvers
//     })
// );

// module.exports = app;

