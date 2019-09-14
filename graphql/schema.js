'use strict';

const { GraphQLSchema } = require('graphql');
const RootQuery = require('./rootQuery');

module.exports = new GraphQLSchema({
	query: RootQuery,
});
