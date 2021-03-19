import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import express from 'express';
import dotenv from 'dotenv';
import { createConnection, useContainer } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions'

import { TestResolver } from './Resolvers/TestResolver';
import { Card } from './Model/Card';
import { Stage } from './Model/Stage';
import { Workflow } from './Model/Workflow';
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
		host: process.env.DB_HOST,
		port: parseInt(process.env.DB_PORT),
		username: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_DATABASE,
		entities: [
			Card,
			Stage,
			Workflow
		],
		synchronize: true,
		logging: true
	}).then(async () => {
		app.listen(process.env.PORT, () => console.log(`Api service listening at http://localhost:${process.env.PORT} || http://localhost:${process.env.PORT}${server.graphqlPath}`))
	})
})()