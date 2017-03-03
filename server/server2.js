'use strict'

// Get required
var express = require( 'express' );
// var http = require( 'http' );
var oauth = require( 'oauth' );


//temporary connection to front-end
const cq = 'localhost:4200'

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


var key = '0g2b7qc51yenv3co98av1m5k';
var secret = 'zcb8oys17z';

// Set domain and callback
var domain = "http://localhost:3000/auth";
var callback = "/callback";

// Set permissions scope
// var scope = [ 'listings_r', 'transactions_r', 'profile_r' ]

// Instantiate OAuth object
var oa = new oauth.OAuth(
  'https://openapi.etsy.com/v2/oauth/request_token?scope=listings_r%20transactions_r%20profile_r%20email_r',
  'https://openapi.etsy.com/v2/oauth/access_token',
  key,
  secret,
  '1.0A',
  domain + callback,
  'HMAC-SHA1'
)


app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
  extended: false
} ) )

// // Setup the Express server
// var server = http.createServer( app );

const cookieSession = require( 'cookie-session' );

app.use( cookieSession( {
  name: 'session',
  secret: 'supersecret'
} ) );


const path = require( 'path' );
app.use( express.static( path.join( __dirname, 'public' ) ) );

// API ROUTES
const auth = require( './routes/auth' );
app.use( '/auth', auth )

const orders = require( './routes/orders' )
app.use( '/orders', orders )



app.use( '/*', function( req, res, next ) {
  res.send( "Ooops" );
} );

const port = process.env.PORT || 3000;

app.listen( port, () => {
  console.log( 'Listening on port', port );
} );

module.exports = {
  app: app,
}
