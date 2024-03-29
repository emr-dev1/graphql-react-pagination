'use strict';

const {
	GraphQLObjectType,
	GraphQLBoolean,
	GraphQLInt,
	GraphQLString,
	GraphQLList,
	GraphQLID,
	GraphQLFloat,
} = require('graphql');

const { db } = require('./utils/dbConnection');

const RateLimit = new GraphQLObjectType({
	name: 'RateLimit',
	description: `Represents the client's rate limit.`,
	fields: () => ({

	})
});

const PageInfoType = new GraphQLObjectType({
	name: 'PageInfo',
	description: 'Provides information about pagaination in a connection.',
	fields: () => ({
		startCursor: {
			type: GraphQLString,
			description: 'When paginating backwards, the cursor to continue'
		},
		endCursor: {
			type: GraphQLString,
			description: 'When paginating forwards, the cursor to continue.'
		},
		hasNextPage: {
			type: GraphQLBoolean,
			description: 'When paginating forward, are there more items?'
		},
		hasPreviousPage: {
			type: GraphQLBoolean,
			description: 'When paginating backwards, are there more items?'
		},
	})
});

const BusinessType = new GraphQLObjectType({
	name: 'Business',
	fields: () => ({
		business_id: {
			type: GraphQLID,
			description: 'The unique ID of the business'
		},
		name: {
			type: GraphQLString,
			description: 'The business name'
		},
		phone_number: {
			type: GraphQLString,
			description: 'The phone number of the business'
		},
		state: {
			type: GraphQLString,
			description: 'The state which the business is located'
		},
		address: {
			type: GraphQLString,
			description: 'The street address of the business'
		},
		latitude: {
			type: GraphQLString,
			description: 'The latitude of the business'
		},
		longitude: {
			type: GraphQLString,
			description: 'The longitude of the business'
		},
	})
});

const BusinessEdgeType = new GraphQLObjectType({
	name: 'BusinessEdge',
	description: 'An edge in a connection',
	fields: () => ({
		cursor: {
			type: GraphQLString,
			description: 'A cursor for use in pagination'
		},
		node: {
			type: BusinessType,
			description: 'The item at the end of the edge'
		}
	})
});

const BusinessConnectionType = new GraphQLObjectType({
	name: 'BusinessConnection',
	description: 'Look up businesses',
	fields: () => ({
		edges: {
			type: GraphQLList(BusinessEdgeType),
			description: 'A list of edges'
		},
		nodes: {
			type: GraphQLList(BusinessType),
			description: 'A list of nodes'
		},
		pageInfo: {
			type: PageInfoType,
			description: 'Information to aid in pagination',
		},
		totalCount: {
			type: GraphQLInt,
			description: 'Identifies the total count of items in the connection'
		}
	})
});

const ProductType = new GraphQLObjectType({
	name: 'Product',
	fields: () => ({
		product_id: { type: GraphQLID },
		product_name: { type: GraphQLString },
		price: { type: GraphQLFloat },
		business_id: { type: GraphQLInt }
	})
});

module.exports = {
	BusinessType,
	ProductType,
	BusinessConnectionType
};
