const expressGraphQL = require('express-graphql');
const express = require('express');
const schema = require('./graphql/schema');

const app = express();

app.use('/graphql', expressGraphQL(req => ({
	schema,
	graphiql: true
})));

app.listen(3000, () => {
	console.log('server started on port 3000');
});
