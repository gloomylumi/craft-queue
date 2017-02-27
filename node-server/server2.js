'use strict';

const express = require( 'express' );
const app = express();

if ( process.env.NODE_ENV !== 'production' ) {
  require( 'dotenv' ).config();
}

const cookieParser = require( 'cookie-parser' )
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

app.use( cookieParser )

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
  extended: false
} ) )

const passport = require( 'passport' ),
  OAuthStrategy = require( 'passport-oauth' ).OAuthStrategy;
app.use( passport.initialize() );
passport.use( 'etsy', new OAuthStrategy( {
    requestTokenURL: 'https://openapi.etsy.com/v2/oauth/request_token',
    accessTokenURL: 'https://openapi.etsy.com/v2/oauth/access_token',
    userAuthorizationURL: 'https://www.etsy.com/oauth/signin',
    consumerKey: '0g2b7qc51yenv3co98av1m5k',
    consumerSecret: 'zcb8oys17z',
    callbackURL: 'http://localhost:4200/auth/etsy/callback'
  },
  function onSuccessfulLogin( token, tokenSecret, profile, done ) {
    // This is a great place to find or create a user in the database
    // This function happens once after a successful login
    User.findOrCreateBy( {
      etsyID: profile.id
    } ).then( user => {

      // Whatever you pass to `done` gets passed to `serializeUser`
      done( null, {
        token,
        user
      } );
    } )
  }
) );

const path = require( 'path' );
app.use( express.static( path.join( __dirname, 'src' ) ) );
app.use( express.static( path.join( __dirname, '/../', 'node_modules' ) ) );

// app.use( '/', require( './routes/auth' ) )

// Redirect the user to the OAuth provider for authentication.  When
// complete, the provider will redirect the user back to the application at
//     /auth/provider/callback
app.get( '/auth/etsy', passport.authenticate( 'etsy' ) );

// The OAuth provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
app.get( '/auth/etsy/callback',
  passport.authenticate( 'etsy', {
    successRedirect: '/',
    failureRedirect: '/login'
  } ) );
app.use( '*', function( req, res, next ) {
  res.sendFile( 'index.html', {
    root: path.join( __dirname, 'src' )
  } )
} )
const port = process.env.PORT || 4200;

app.listen( port, () => {
  console.log( 'Listening on port', port );
} );

module.exports = app;
