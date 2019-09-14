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
			description: 'Look up businesses',
			args: {
				after: {
					type: GraphQLInt,
					description: 'Returns the elements that come after the specified cursor',
				},
				before: {
					type: GraphQLInt,
					description: 'Returns the elements in the list that come before the specified cursor',
				},
				first: {
					type: GraphQLInt,
					description: 'Returns the first n elements from the list',
				},
				last: {
					type: GraphQLInt,
					description: 'Returns the last n elements from the list',
				},
			},
			resolve(parent, args, context, info) {
				
			}
		}
	}
});
