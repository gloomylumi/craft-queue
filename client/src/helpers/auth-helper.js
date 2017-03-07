'use strict'

var exports = module.exports = {}

const oauth = require( 'oauth' )


var key = '0g2b7qc51yenv3co98av1m5k';
var secret = 'zcb8oys17z';

// Set domain and callback
var domain = "http://localhost:3000/auth";
var callback = "/callback";

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
