'use strict'

var exports = module.exports = {}

const oauth = require( 'oauth' )

if ( process.env.NODE_ENV !== 'production' ) {
  require( 'dotenv' ).config();
}


var key = process.env.KEY;
var secret = process.env.SECRET;


// Set domain and callback
var domain = process.env.DOMAIN;
var callback = "/api/auth/callback";

// Instantiate OAuth object
exports.oa = new oauth.OAuth(
  'https://openapi.etsy.com/v2/oauth/request_token?scope=listings_r%20transactions_r%20profile_r%20email_r',
  'https://openapi.etsy.com/v2/oauth/access_token',
  key,
  secret,
  '1.0A',
  domain + callback,
  'HMAC-SHA1'
)
