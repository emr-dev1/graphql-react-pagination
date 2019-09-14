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

exports.generateQuery = (table, filter, ...args) => {
	const { first, last, beforeCursor, afterCursor } = args;

	let numberOfElements;
	if (first && !last) {
		numberOfElements = ``;
	} else if (!first && last) {
		numberOfElements = ``;
	} else {
		// TODO: throw an arror
	}

	let cursorQuery;
	if (beforeCursor) {
		cursorQuery = `${beforeCursor}`;
	} else if (afterCursor) {
		cursorQuery = ``;
	}

	let order;
	if (filter) {
		order = `${filter} `;
	}

	return `
		select * 
		from 
			management_system.${table}
		order by${filter}
	`;
};
