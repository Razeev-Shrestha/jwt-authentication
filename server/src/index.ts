import 'reflect-metadata';

import express from 'express';

import { createConnection } from 'typeorm';

import path from 'path';
import env from 'dotenv';

import cors from 'cors';

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { buildSchema } from 'type-graphql';

import cookieParser from 'cookie-parser';

import { UserResolver } from './resolver';
import { verify } from 'jsonwebtoken';
import { User } from './entity';
import {
	createAccessToken,
	createRefreshToken,
	sendRefreshToken,
} from './utils';

env.config({ path: path.join(__dirname, '../.env.local') });
(async () => {
	const app = express();
	app.use(
		cors({
			credentials: true,
			origin: 'http://localhost:3000',
		})
	);

	app.use(cookieParser());
	app.post('/refresh_token', async (req, res) => {
		const token = req.cookies.jid;
		if (!token) {
			return res.send({ ok: false, accessToken: '' });
		}

		let payload: any = null;
		try {
			payload = verify(token, process.env.JWT_REFRESH_KEY!);
		} catch (err: any) {
			console.log(err);
			return res.send({ ok: false, accessToken: '' });
		}

		const user = await User.findOne({ id: payload.userId });

		if (!user) {
			return res.send({ ok: false, accessToken: '' });
		}

		if (user.tokenVersion !== payload.tokenVersion) {
			return res.send({ ok: false, accessToken: '' });
		}

		sendRefreshToken(res, createRefreshToken(user));

		return res.send({ ok: true, accessToken: createAccessToken(user) });
	});

	await createConnection();

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [UserResolver],
		}),
		context: ({ req, res }) => ({ req, res }),
		plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
	});

	await apolloServer.start();

	apolloServer.applyMiddleware({ app, cors: false });
	app.listen(process.env.PORT!, () =>
		console.log(
			`Server is up and running on http://localhost:${process.env.PORT!}`
		)
	);
})();
