'use strict';

const pgPromise = require('pg-promise');
const pgp = pgPromise({});
const config = require('../../config');

exports.db = { conn: pgp(config.database) };
