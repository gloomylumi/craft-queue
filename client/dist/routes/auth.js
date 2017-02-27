'use strict'
const express = require( 'express' )

const router = express.Router()
// Authentication with passport-etsy
const passport = require( 'passport' )

// Redirect the user to the OAuth provider for authentication.  When
// complete, the provider will redirect the user back to the application at
//     /auth/provider/callback
router.get( '/etsy', passport.authenticate( 'etsy', {
  scope: [ 'listings_r', 'profile_r', 'transactions_r' ]
} ), function( req, res ) {

} );

// The OAuth provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
router.get( '/etsy/callback',
  passport.authenticate( 'etsy', {
    successRedirect: '/',
    failureRedirect: '/'
  } ) );

router.get( '/logout', function( req, res ) {
  req.logout();
  res.redirect( '/' );
} );
