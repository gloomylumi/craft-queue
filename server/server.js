'use strict';

const express = require( 'express' );
const app = express();

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

const path = require( 'path' );
app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( express.static( path.join( __dirname, '/../', 'node_modules' ) ) );


// Authentication with passport-etsy
const passport = require( 'passport' )
const EtsyStrategy = require( 'passport-etsy' ).Strategy

passport.use( new EtsyStrategy( {
    consumerKey: 'YOUR_KEY_GOES_HERE',
    consumerSecret: 'YOUR_SECRET_GOES_HERE',
    callbackURL: 'http://localhost:3000/auth/etsy/callback'
  },
  function( token, tokenSecret, profile, done ) {
    User.findOrCreate( {
      etsyID: profile.id
    } )
  }
) );
app.get( '/auth/etsy', passport.authenticate( 'etsy', {
  scope: [ 'listings_r', 'profile_r', 'transactions_r' ]
} ) );
app.get( '/auth/etsy/callback',
  passport.authenticate( 'etsy', {
    successRedirect: '/',
    failureRedirect: '/login'
  } ) );

// const messages = require( './routes/classifieds' );
//
// app.use( '/classifieds', messages );
// app.use( '*', function( req, res, next ) {
//   res.sendFile( 'index.html', {
//     root: path.join( __dirname, 'public' )
//   } )
// } )

const port = process.env.PORT || 3000;

app.listen( port, () => {
  console.log( 'Listening on port', port );
} );

module.exports = app;
