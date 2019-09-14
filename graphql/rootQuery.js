'use strict';

const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLBoolean,
	GraphQLInt,
	GraphQLString,
	GraphQLList,
	GraphQLID,
} = require('graphql');

const { db } = require('./utils/dbConnection');

const {
	BusinessType,
	BusinessConnectionType,
} = require('./types');

const {
	encodeCursor,
	decodeCursor,
	generateQuery,
} = require('./utils/paginator');

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
					type: GraphQLInt,
					description: 'Returns the elements that come after the specified cursor',
				},
				before: {
					type: GraphQLInt,
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
			async resolve(parent, args, context, info) {
				const totalCountQuery = 'select count(*) from management_system.businesses';
				const totalCount = (await db.conn.one(totalCountQuery)).count;

				// TODO: refactor the way the query is formed: 79-119
				let query;
				let numberOfElements;
				if (args.first && !args.last) {
					// use the first n elements in the array
					numberOfElements = args.first;
				} else if (!args.first && args.last) {
					// use the last n elements in the array
					numberOfElements = args.last;
				} else {
					// TODO: throw an error
				}

				query = `select * from management_system.businesses limit ${context.limit}`;
				let decodedCursor;
				if (args.after && !args.before) {
					// elements after specified cursor, decode
					decodedCursor = decodeCursor(args.after);
					query = `
						select
							TOP(${numberOfElements}) * 
						from 
							management_system.businesses
						where
							business_id >= ${decodedCursor}
						order by business_id
						limit ${context.limit};
					`;
				} else if (!args.after && args.before) {
					// elements before specified cursor, decode
					decodedCursor = decodeCursor(args.before);
					query = `
						select 
							TOP(${numberOfElements}) *
						from
							management_system.businesses
						where
							business_id < ${decodedCursor}
						order by business_id desc
						limit ${context.limit}
					`;
				}

				const businesses = await db.conn.manyOrNone(query);

				// for now going to use the "business_id" as the cursor
				const edges = businesses.map((business) => {
					const encodedCursor = encodeCursor(`${business.business_id}`);
					return {
						cursor: encodedCursor,
						node: { ...business }
					};
				});

				const startCursor = edges[0].cursor;
				const endCursor = edges[edges.length - 1].cursor;
				// TODO: refactor how next/previous page's values are generated
				const hasNextPage = true;
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
