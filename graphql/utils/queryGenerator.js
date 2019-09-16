'use strict';

const { decodeCursor } = require('./paginator');

exports.generatePaginationQuery = function (table, column, limit, args) {
	const { first, last, before, after } = args;
	let numberOfElements;
	let filter;
	let where;

	// for each of these we need to make sure that we do not go over the limit
	// for queries that a client can make
	if (first && !last) {
		// this means that we want the top of the query
		numberOfElements = first > limit ? limit : first;
		filter = `ORDER BY ${column}`;
	} else if (!first && last) {
		// this means that we want the bottom of the query
		// so to achieve this we should flip the result
		// with "ORDER BY DESC"
		numberOfElements = last > limit ? limit : last;
		filter = `ORDER BY ${column} DESC`;
	}

	if (after && !before) {
		// get the results that follow the cursor "after" in the result set
		where = `WHERE ${column} > ${parseInt(decodeCursor(after), 10)}`;
	} else if (!after && before) {
		// get the results that precede the cursor "before" in the result set
		where = `WHERE ${column} < ${parseInt(decodeCursor(before), 10)}`;
	} else {
		where = '';
	}

	return `SELECT * FROM ${table} ${where} ${filter} LIMIT ${numberOfElements}`;
};
