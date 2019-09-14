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

module.exports = new GraphQLObjectType({
	name: 'RootQuery',
	fields: {
		businesses: {
			type: new GraphQLList(BusinessesType),
			args: {
				first: { type: GraphQLInt },
				offset: { type: GraphQLInt },
				filter: { type: GraphQLString }
			},
			resolve(parent, { first, offset, filter }, context, info) {
				console.log(info);
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
			resolve(parent, args, context, info) {
				// TODO: need to resolve: pageInfo, edges, nodes, and totalCount
				const totalCountQuery = 'select count(*) from management_system.businesses order by business_id';

				// TODO: check whether first or last provided in the args
				// TODO: check whether after or before is provided in the args
				// TODO: construct sql query with provided args
				
				// TODO: determine what unique identifier will act as the cursor (ID)
				// TODO: encode the cursors for each type
				// edge = cursor and node
				// node = [BusinessType]
				// TODO: set the edges with their respective cursor
				// TODO: set the nodes to the array of businesses
				// TODO: get the start and ending cursors
				// TODO: set the next and previous page booleans

				// TODO: return an object with the correct structure
			}
		}
	}
});
