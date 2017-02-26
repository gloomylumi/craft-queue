'use strict';

const express = require( 'express' );
const app = express();

if ( process.env.NODE_ENV !== 'production' ) {
  require( 'dotenv' ).config();
}

const bodyParser = require( 'body-parser' )
const morgan = require( 'morgan' );

switch ( app.get( 'env' ) ) {
  case 'development':
    app.use( morgan( 'dev' ) );
    break;

  case 'production':
    app.use( morgan( 'short' ) );
    break;
}

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
  extended: false
} ) )

const path = require( 'path' );
app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( express.static( path.join( __dirname, '/../', 'node_modules' ) ) );

// const messages = require( './routes/classifieds' );
//
// app.use( '/classifieds', messages );
// app.use( '*', function( req, res, next ) {
//   res.sendFile( 'index.html', {
//     root: path.join( __dirname, 'public' )
//   } )
// } )

const port = process.env.PORT || 3000;

app.listen( port, () => {
  console.log( 'Listening on port', port );
} );

module.exports = app;
