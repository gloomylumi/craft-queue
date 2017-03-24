'use strict'

exports.up = function( knex, Promise ) {
  knex.schema.createTable( 'listings', function( table ) {
    table.integer( 'listing_id' ).primary().notNullable()
    table.integer( 'shop_id' ).notNullable()
    table.integer( 'processing_time' ).defaultTo( 0 )
    table.string( 'image_thumbnail_url' )
    table.string( 'image_full_url' )
    table.timestamps( true, true )
  } )
};

exports.down = function( knex, Promise ) {
  knex.schema.dropTable( 'listings' )
};
