const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const cors = require("cors");

const app = express();

// allow cross-origin requests
app.use(cors());

app.use(
  "/",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

module.exports = app;
