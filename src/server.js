'use strict'

// Get required
var express = require( 'express' );

// Instantiate Express
var app = express();

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

// // Setup the Express server

const cookieSession = require( 'cookie-session' );

app.use( cookieSession( {
  name: 'session',
  secret: process.env.COOKIESECRET
} ) );


const path = require( 'path' );
app.use( express.static( path.join( __dirname, 'app' ) ) );

// API ROUTES
const auth = require( './routes/auth' );
app.use( '/auth', auth )

const orders = require( './routes/orders' )
app.use( '/orders', orders )



app.use( '/*', function( req, res, next ) {
  res.sendFile( __dirname, 'index.html' );
} );

const port = process.env.PORT || 3000;

app.listen( port, () => {
  console.log( 'Listening on port', port );
} );

module.exports = {
  app: app,
}
