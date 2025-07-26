import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    status: String!
  }
`;

const resolvers = {
  Query: {
    status: () => 'ok',
  },
};

async function start() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const port = process.env.GRAPHQL_PORT || 4000;
  app.listen(port, () => {
    console.log(
      `API GraphQL escuchando en http://localhost:${port}${server.graphqlPath}`,
    );
  });
}

start();
