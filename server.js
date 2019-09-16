'use strict';

const expressGraphQL = require('express-graphql');
const http = require('http');
const express = require('express');
const cors = require('cors');
const schema = require('./graphql/schema');

const app = express();

app.use(cors());

app.use('/', expressGraphQL(req => ({
	schema,
	graphiql: true,
	context: {
		request: req,
		limit: 50
	}
})));

const server = http.createServer(app);
server.listen(3000);
