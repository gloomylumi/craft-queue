'use strict';

var pg = require( 'pg' );
pg.types.setTypeParser( 1700, 'text', parseInt );

const environment = process.env.NODE_ENV || 'development';
const knexConfig = require( './knexfile' )[ environment ];
const knex = require( 'knex' )( knexConfig );

module.exports = knex;
