'use strict'

const express = require( 'express' );
const http = require( 'http' );
const oauth = require( 'oauth' );
const cookieSession = require( 'cookie-session' );
const knex = require( '../knex' );
const router = express.Router();

// Set Etsy consumer credentials
var key = '0g2b7qc51yenv3co98av1m5k';
var secret = 'zcb8oys17z';

// Set domain and callback
var domain = "http://localhost:3000";
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
);

// Root route
router.get( '/', function( req, res ) {

  // If session variable has not been initialized
  if ( !req.session.oauth ) {
    console.log( '*** initializing req.session.oauth ***' );
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
router.get( '/get-access-token', function( req, res ) {

  console.log( '*** get-access-token ***' )

  oa.getOAuthRequestToken( function( error, token, token_secret, results ) {
    console.log( req.session.oauth );
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
router.get( '/callback', function( req, res ) {

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

          test( req, res )
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
        if ( !req.session.shop_id ) {
          req.session.shop_id = ( JSON.parse( data ) ).results[ 0 ].user_id
          console.log( 'set shop_id to:', ( JSON.parse( data ) ).results[ 0 ].user_id );
        }
        console.log( data );
        console.log( '*** SUCCESS! ***' );
        res.sendFile( __dirname + '/home.html' );
      }
    }
  );
}
module.exports = router
