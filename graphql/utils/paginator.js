'use strict';

/**
 * Encodes a cursor to Base64 for pagination.
 * @param {String} cursor The cursor to enode.
 * @returns {String} The Base64 encoded string.
 */
exports.encodeCursor = cursor => Buffer.from(cursor).toString('base64');

/**
 * Decodes a Base64 encoded cursor to ASCII.
 * @param {String} cursor The cursor to decode.
 * @returns {String} The ASCII decoded cursor.
 */
exports.decodeCursor = cursor => Buffer.from(cursor, 'base64').toString('ascii');

exports.generateQuery = (table, limit, ...args) => {
	const { first, last, beforeCursor, afterCursor } = args;

	let numberOfElements;
	if (first && !last) {
		numberOfElements = `TOP(${first})`;
	} else if (!first && last) {
		numberOfElements = `TOP(${last})`;
	}

	let cursorQuery;
	let filter = '';
	if (beforeCursor) {
		cursorQuery = `< ${beforeCursor}`;
		filter = 'business_id desc';
	} else if (afterCursor) {
		cursorQuery = `>= ${afterCursor}`;
		filter = 'business_id';
	}

	return `
		select
			${numberOfElements} *
		from
			management_system.${table}
		where
			business_id ${cursorQuery}
		order by ${filter}
		limit ${limit}
	`;
};
