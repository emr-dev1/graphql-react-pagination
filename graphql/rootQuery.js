'use strict';

const {
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLList,
} = require('graphql');

const { db } = require('./utils/dbConnection');

const {
	BusinessType,
	BusinessConnectionType,
} = require('./types');

const {
	encodeCursor,
} = require('./utils/paginator');

const {
	generatePaginationQuery,
} = require('./utils/queryGenerator');

module.exports = new GraphQLObjectType({
	name: 'RootQuery',
	fields: {
		businesses: {
			type: new GraphQLList(BusinessType),
			args: {
				first: { type: GraphQLInt },
				offset: { type: GraphQLInt },
				filter: { type: GraphQLString }
			},
			resolve(parent, { first, offset, filter }, context, info) {
				const query = `
					select *
					from
						management_system.businesses
					order by
						business_id
					limit ${first} offset ${offset}
				`;
				return db.conn.any(query)
					.then((data) => {
						return data;
					})
					.catch(err => `The error is ${err}`);
			}
		},
		businessConnection: {
			// There needs to be a set rate limit for the number of elements that
			// can be retireved at a time.
			type: BusinessConnectionType,
			description: 'Look up businesses, must provide first or last to properly paginate',
			args: {
				after: {
					type: GraphQLString,
					description: 'Returns the elements that come after the specified cursor',
				},
				before: {
					type: GraphQLString,
					description: 'Returns the elements in the list that come before the specified cursor',
				},
				// REQUIRED TO PROPERLY PAGINATE
				first: {
					type: GraphQLInt,
					description: 'Returns the first n elements from the list',
				},
				// REQUIRED TO PROPERLY PAGINATE
				last: {
					type: GraphQLInt,
					description: 'Returns the last n elements from the list',
				},
			},
			async resolve(_, args, context) {
				const totalCountQuery = 'select count(*) from management_system.businesses';
				const totalCount = (await db.conn.one(totalCountQuery)).count;
				const query = generatePaginationQuery('management_system.businesses', 'business_id', context.limit, args);
				console.log(query);
				const businesses = await db.conn.manyOrNone(query);

				// for now going to use the "business_id" as the cursor
				const edges = businesses.map((business) => {
					const encodedCursor = encodeCursor(`${business.business_id}`);
					return {
						cursor: encodedCursor,
						node: { ...business }
					};
				});

				const amount = args.first ? args.first : args.last;
				const startCursor = edges[0].cursor;
				const endCursor = edges[edges.length - 1].cursor;
				const hasNextPage = amount - businesses.length === 0;
				const hasPreviousPage = false;

				return {
					pageInfo: {
						startCursor,
						endCursor,
						hasNextPage,
						hasPreviousPage
					},
					edges,
					nodes: businesses,
					totalCount: parseInt(totalCount, 10)
				};
			}
		}
	}
});
