import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import express from 'express';
import dotenv from 'dotenv';

import { TestResolver } from './Resolvers/TestResolver';
import { createConnection, useContainer } from 'typeorm';
import { Card } from './Model/Card';
import { Stage } from './Model/Stage';
import { Workflow } from './Model/Workflow';
import { Container } from 'typeorm-typedi-extensions'
import { WorkflowResolver } from './Resolvers/WorkflowResolver';
import { StageResolver } from './Resolvers/StageResolver';
import { CardResolver } from './Resolvers/CardResolver';

dotenv.config()

const app = express();

(async () => {
	const server = new ApolloServer({
		schema: await buildSchema({
			resolvers: [
				TestResolver,
				WorkflowResolver,
				StageResolver,
				CardResolver
			],
			container: Container
		}),
		introspection: true,
		tracing: true
	})

	server.applyMiddleware({ app, path: '/api/graphql' });

	useContainer(Container);

	createConnection({
		type: 'postgres',
		host: 'localhost',
		port: 5433,
		username: 'postgres',
		password: 'test123',
		database: 'tuesday',
		entities: [
			Card,
			Stage,
			Workflow
		],
		synchronize: true,
		logging: true
	}).then(async _ => {
		app.listen(process.env.PORT, () => console.log(`Api service listening at http://localhost:${process.env.PORT} || http://localhost:${process.env.PORT}${server.graphqlPath}`))
	})
})()