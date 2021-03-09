import "reflect-metadata";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import express from 'express';
import { TestResolver } from "./Resolvers/TestResolver";
import dotenv from 'dotenv';
dotenv.config()
const app = express();

(async () => {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        TestResolver,
      ]
    }),
    introspection: true,
    tracing: true
  })

  server.applyMiddleware({ app, path: "/api/graphql" });

  app.listen(process.env.PORT, () => console.log(`Api service listening at http://localhost:${process.env.PORT} || http://localhost:${process.env.PORT}${server.graphqlPath}`))
})()