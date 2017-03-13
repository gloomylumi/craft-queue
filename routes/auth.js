'use strict'

const express = require( 'express' );
const oauth = require( 'oauth' );
const cookieSession = require( 'cookie-session' );
const router = express.Router();
const oa = require( '../helpers/auth-helper' ).oa
if ( process.env.NODE_ENV !== 'production' ) {
  require( 'dotenv' ).config();
}


// Root route
router.get( '/', function( req, res ) {

  // if ( err ) {
  //   console.log( "***** error ******", err );
  //   return err
  // }
  // If session variable has not been initialized
  if ( !req.session.oauth ) {
    console.log( '*** initializing req.session.oauth ***' );
    req.session.oauth = {};
  }

  // If access token has not been generated
  if ( !req.session.oauth.access_token ) {
    res.redirect( '/api/auth/get-access-token' );
  } else {
    test( req, res );
  }
} );

// Request OAuth request token, and redirect the user to authorization page
router.get( '/get-access-token', function( req, res ) {

  console.log( '*** get-access-token ***' )

  oa.getOAuthRequestToken( function( error, token, token_secret, results ) {
    if ( error ) {
      console.log( error );
    } else {
      req.session.oauth.token = token;
      req.session.oauth.token_secret = token_secret;

      console.log( 'Token: ' + token );
      console.log( 'Secret: ' + token_secret );
      console.log( "redirect:", results[ "login_url" ] );

      res.send( results[ "login_url" ] );
    }
  } );

} );

// Get OAuth access token on callback
router.get( '/callback', function( req, res, next ) {

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
    "https://openapi.etsy.com/v2/users/__SELF__/shops",
    "GET",
    req.session.oauth.access_token,
    req.session.oauth.access_token_secret,
    function( error, data, response ) {
      //TODO: add validation for users without shops
      let dataParse = JSON.parse( data )
      console.log( dataParse );
      if ( !req.session.user_id ) {
        req.session.user_id = dataParse.results[ 0 ].user_id

        console.log( 'set user_id to:', dataParse.results[ 0 ].user_id );
      }
      if ( !req.session.shop_id ) {
        req.session.shop_id = ( JSON.parse( data ) ).results[ 0 ].shop_id
        console.log( 'set shop_id to:', ( JSON.parse( data ) ).results[ 0 ].shop_id );
      }
      console.log( '*** SUCCESS! ***' );
      res.redirect( '/user/orders' );
    }
  )
}
module.exports = router
