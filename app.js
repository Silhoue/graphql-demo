const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema");

const port = 4000;
const app = express();

app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(port, function () {
  console.log("App listening on port " + port);
});
