'use strict'
var express = require( 'express' ),
  path = require( 'path' ),
  fs = require( 'fs' );

var app = express();
const cookieParser = require( 'cookie-parser' )
const cookieSession = require( 'cookie-session' )
const bodyParser = require( 'body-parser' )

require( 'dotenv' ).load();

var staticRoot = __dirname + '/';

app.set( 'port', ( process.env.PORT || 4200 ) );

app.use( express.static( staticRoot ) );


const passport = require( 'passport' );
// const OAuthStrategy = require( 'passport-oauth' ).OAuthStrategy;
const EtsyStrategy = require( 'passport-etsy' ).Strategy;

// const auth = require( './routes/auth' )

app.use( cookieSession( {
  name: 'session',
  keys: [ process.env[ 'SECRET_KEY' ] ]
} ) );
app.use( passport.initialize() );
app.use( passport.session() )

passport.serializeUser( function( user, done ) {
  // TODO populate identifier
  //later this will be where you selectively send to the browser an identifier for your user, like their primary key from the database, or their ID from linkedin
  console.log( 'in serializwe' );
  done( null, user );
} );

passport.deserializeUser( function( obj, done ) {
  // TODO get user from database
  //here is where you will go to the database and get the user each time from it's id, after you set up your db
  console.log( 'in deserialize' );
  done( null, obj );
} );

// passport.use( 'etsy', new OAuthStrategy( {
//     requestTokenURL: 'https://openapi.etsy.com/v2/oauth/request_token',
//     accessTokenURL: 'https://openapi.etsy.com/v2/oauth/access_token',
//     userAuthorizationURL: 'https://www.etsy.com/oauth/signin',
//     consumerKey: '0g2b7qc51yenv3co98av1m5k',
//     consumerSecret: 'zcb8oys17z',
//     callbackURL: 'http://localhost:4200/auth/etsy/callback'
//   },
//   function( token, tokenSecret, profile, done ) {
//     // TODO: perist to database
//     // To keep the example simple, the user's LinkedIn profile is returned to
//     // represent the logged-in user.  In a typical application, you would want
//     // to associate the LinkedIn account with a user record in your database,
//     // and return that user instead (so perform a knex query here later.)
//     return done( null, profile );
//   }
// ) );

passport.use( new EtsyStrategy( {
    consumerKey: '0g2b7qc51yenv3co98av1m5k',
    consumerSecret: 'zcb8oys17z',
    callbackURL: 'http://localhost:4200/auth/etsy/callback'
  },
  function( token, tokenSecret, profile, done ) {
    console.log( 'in strategy' )
    return done( null, profile )
  }
) );

// app.use( '/auth', auth );

// app.get( '/auth/etsy', passport.authenticate( 'etsy', {
//   scope: [ 'listings_r', 'profile_r', 'transactions_r' ]
// } ), function( req, res ) {
//
// } );

app.get( '/auth/etsy', passport.authenticate( 'etsy', {
  scope: [ 'profile_r', 'email_r', 'listings_r', 'profile_w' ]
} ) );

app.get( '/auth/etsy/callback', ( req, res, next ) => {
  console.log( 'in callback' )
  next();
}, passport.authenticate( 'etsy', {
  successRedirect: '/',
  failureRedirect: '/'
} ) );

app.get( '/auth/logout', function( req, res ) {
  req.logout();
  res.redirect( '/' );
} );


app.use( function( req, res, next ) {
  // if the request is not html then move along
  var accept = req.accepts( 'html', 'json', 'xml' );
  if ( accept !== 'html' ) {
    return next();
  }

  // if the request has a '.' assume that it's for a file, move along
  var ext = path.extname( req.path );
  if ( ext !== '' ) {
    return next();
  }

  fs.createReadStream( staticRoot + 'index.html' ).pipe( res );

} );


//app.all('/*', function(req, res, next) {
//    res.sendFile('index.html', { root: __dirname + '/' });
//});

app.listen( app.get( 'port' ), function() {
  console.log( 'app running on port', app.get( 'port' ) );
} );
