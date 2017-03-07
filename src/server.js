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
const forceSSL = function() {
  return function( req, res, next ) {
    if ( req.headers[ 'x-forwarded-proto' ] !== 'https' ) {
      return res.redirect(
        [ 'https://', req.get( 'Host' ), req.url ].join( '' )
      );
    }
    next();
  }
}

app.use( forceSSL() )

const cookieSession = require( 'cookie-session' );

app.use( cookieSession( {
  name: 'session',
  secret: process.env.COOKIESECRET
} ) );


const path = require( 'path' );
if ( process.env.NODE_ENV !== 'production' ) {

  app.use( express.static( path.join( __dirname, 'app' ) ) );
} else {
  app.use( express.static( path.join( __dirname, 'dist' ) ) );
}

// API ROUTES
const auth = require( './routes/auth' );
app.use( '/api/auth', auth )

const orders = require( './routes/orders' )
app.use( '/api/orders', orders )

if ( process.env.NODE_ENV !== 'production' ) {
  app.use( '/*', function( req, res, next ) {
    res.sendFile( path.join( __dirname, 'index.html' ) );
  } );
} else {
  app.use( '/*', function( req, res, next ) {
    res.sendFile( path.join( __dirname, 'dist/index.html' ) );
  } );
}



const port = process.env.PORT || 8080;

app.listen( port, () => {
  console.log( 'Listening on port', port );
} );

module.exports = {
  app: app,
}
