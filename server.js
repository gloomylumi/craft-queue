'use strict'

// Get required
const express = require( 'express' );

// Instantiate Express
const app = express();
// const cookieParser = require( 'cookie-parser' )
// app.use( cookieParser() )
var cors = require( 'cors' )

app.use( cors( {
  credentials: true,
  origin: true
} ) )
// app.use( function( req, res, next ) {
//   res.header( "Access-Control-Allow-Origin", "*" );
//   res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
//   next();
// } );


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
  secret: 'supersecret'
} ) );


const path = require( 'path' );
if ( process.env.NODE_ENV !== 'production' ) {

  app.use( express.static( path.join( __dirname, 'src' ) ) );
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
    res.sendFile( path.join( __dirname, 'src/index.html' ) );
  } );
} else {
  app.use( '/*', function( req, res, next ) {
    res.sendFile( path.join( __dirname, 'dist/index.html' ) );
  } );
}



const port = process.env.PORT || 3000;

app.listen( port, () => {
  console.log( 'Listening on port', port );
} );

module.exports = {
  app: app,
}
