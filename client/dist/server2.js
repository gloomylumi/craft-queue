// Get required
var express = require( 'express' );
var http = require( 'http' );
var oauth = require( 'oauth' );
var session = require( 'express-session' );

// Instantiate Express
var app = express();

// Setup the Express server
var server = http.createServer( app );

// Initialize Express Session
app.use( session( {
  saveUninitialized: true,
  secret: "1234567890",
  resave: true
} ) );

// Add static directory
app.use( express.static( __dirname + '/public' ) );

// Set Etsy temporary credentials
var key = '0g2b7qc51yenv3co98av1m5k';
var secret = 'zcb8oys17z';

// Set domain and callback
var domain = "http://localhost:4200";
var callback = "/callback";

// Set permissions scope
var scope = [ 'listings_r', 'transactions_r', 'profile_r' ]

// Instantiate OAuth object
var oa = new oauth.OAuth(
  'https://openapi.etsy.com/v2/oauth/request_token?scope=listings_r%20transactions_r%20profile_r%20email_r',
  'https://openapi.etsy.com/v2/oauth/access_token',
  key,
  secret,
  '1.0A',
  domain + callback,
  'HMAC-SHA1'
);

// Root route
app.get( '/', function( req, res ) {

  // If session variable has not been initialized
  if ( !req.session.oauth ) {
    req.session.oauth = {};
  }

  // If access token has not been generated
  if ( !req.session.oauth.access_token ) {
    res.redirect( '/get-access-token' );
  } else {
    test( req, res );
  }
} );

// Request OAuth request token, and redirect the user to authorization page
app.get( '/get-access-token', function( req, res ) {

  console.log( '*** get-access-token ***' )

  oa.getOAuthRequestToken( function( error, token, token_secret, results ) {
    console.log( req.body );
    if ( error ) {
      console.log( error );
    } else {
      req.session.oauth.token = token;
      req.session.oauth.token_secret = token_secret;

      console.log( 'Token: ' + token );
      console.log( 'Secret: ' + token_secret );

      res.redirect( results[ "login_url" ] );
    }
  } );

} );

// Get OAuth access token on callback
app.get( '/callback', function( req, res ) {

  console.log( '*** callback ***' )

  if ( req.session.oauth ) {

    req.session.oauth.verifier = req.query.oauth_verifier;

    oa.getOAuthAccessToken(
      req.session.oauth.token,
      req.session.oauth.token_secret,
      req.session.oauth.verifier,
      function( error, token, token_secret, results ) {
        if ( error ) {
          console.log( error );
        } else {
          req.session.oauth.access_token = token;
          req.session.oauth.access_token_secret = token_secret;

          console.log( 'Token: ' + token );
          console.log( 'Secret: ' + token_secret );
          console.log( 'Verifier: ' + req.session.oauth.verifier );

          test( req, res );
        }
      }
    );
  }
} );

// Test authorization by accessing protected resource
function test( req, res ) {
  console.log( '*** test ***' );

  oa.getProtectedResource(
    "https://openapi.etsy.com/v2/users/__SELF__",
    "GET",
    req.session.oauth.access_token,
    req.session.oauth.access_token_secret,
    function( error, data, response ) {
      if ( error ) {
        console.log( error );
      } else {
        console.log( data );
        console.log( '*** SUCCESS! ***' );
        res.sendFile( __dirname + '/home.html' );
      }
    }
  );
}

server.listen( 4200 );
console.log( "listening on http://localhost:4200" );
