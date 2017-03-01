exports.up = function( knex, Promise ) {
  return knex.schema.createTable( 'users', function( table ) {
    table.increments().primary().notNullable();
    table.text( 'access_token' )
    table.text( 'access_token_secret' )
    table.string( 'username', 60 ).unique().notNullable()
    table.string( 'password_hash' ).notNullable()
    table.int( 'shop_id' );
  } )
};

exports.down = function( knex, Promise ) {
  return knex.schema.dropTable( 'users' ).onDelete( 'CASCADE' )
};
