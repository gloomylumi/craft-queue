'use strict'

// Get required
const express = require( 'express' );

// Instantiate Express
const app = express();
// const cookieParser = require( 'cookie-parser' )
// app.use( cookieParser() )
var cors = require( 'cors' )

app.use( cors() )
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


// MongoDB
var MongoClient = require( 'mongodb' ).MongoClient,
  assert = require( 'assert' );

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

// Use connect method to connect to the server
MongoClient.connect( url, function( err, db ) {
  assert.equal( null, err );
  console.log( "Connected successfully to server" );

  db.close();
} );

// // Setup the Express server
// const forceSSL = function() {
//   return function( req, res, next ) {
//     if ( req.headers[ 'x-forwarded-proto' ] !== 'https' ) {
//       return res.redirect(
//         [ 'https://', req.get( 'Host' ), req.url ].join( '' )
//       );
//     }
//     next();
//   }
// }

// app.use( forceSSL() )

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

// app.options( '*', cors( {
//   origin: true
// } ) );

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
