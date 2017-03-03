'use strict'
// Order Resource
const express = require( 'express' );
const oauth = require( 'oauth' );
const knex = require( '../knex' );
const router = express.Router();
const axios = require( 'axios' )
const querystring = require( 'querystring' )
const Order = require( '../helpers/order-helper.js' ).Order


console.log( Order );


var key = '0g2b7qc51yenv3co98av1m5k';
var secret = 'zcb8oys17z';

// Set domain and callback
var domain = "http://localhost:3000/auth";
var callback = "/callback";

// Instantiate OAuth object
let oa = new oauth.OAuth(
  'https://openapi.etsy.com/v2/oauth/request_token?scope=listings_r%20transactions_r%20profile_r%20email_r',
  'https://openapi.etsy.com/v2/oauth/access_token',
  key,
  secret,
  '1.0A',
  domain + callback,
  'HMAC-SHA1'
)

router.get( '/all', function( req, res, next ) {
  const shop_id = req.session.shop_id
  let uri = `/shops/${shop_id}/transactions`
  const paramString = '?' + querystring.stringify( {
    limit: 75
  } )
  oa.getProtectedResource(
    "https://openapi.etsy.com/v2" + uri + paramString,
    "GET",
    req.session.oauth.access_token,
    req.session.oauth.access_token_secret,
    function( error, data, response ) {
      if ( error ) {
        console.log( error );
        res.send( error )
      } else {
        console.log( JSON.parse( data ) );
        res.send( JSON.parse( data ) )
      }
    }
  )
} )

// test routes TODO: Delete before production
router.get( '/by_status', function( req, res, next ) {
  const shop_id = req.session.shop_id
  let uri = `/shops/${shop_id}/receipts/open`
  const paramString = '?' + querystring.stringify( {
    limit: 75
  } )
  oa.getProtectedResource(
    "https://openapi.etsy.com/v2" + uri + paramString,
    "GET",
    req.session.oauth.access_token,
    req.session.oauth.access_token_secret,
    function( error, data, response ) {
      if ( error ) {
        console.log( error );
        res.send( error )
      } else {
        console.log( JSON.parse( data ) );
        let orders = []
        JSON.parse( data ).results.forEach( function( receipt ) {
          let order = new Order( receipt.receipt_id, receipt.creation_tsz, receipt.name, receipt.message_from_buyer, receipt.total_price )
          orders.push( order )
        } )
        res.send( orders )
      }
    }
  )
} )

router.get( '/listings', function( req, res, next ) {
  const shop_id = req.session.shop_id
  let uri = `/listings/275905818`
  // const paramString = '?' + querystring.stringify( {
  //   listing_id: 275905818
  // } )
  oa.getProtectedResource(
    "https://openapi.etsy.com/v2" + uri, //+ paramString,
    "GET",
    req.session.oauth.access_token,
    req.session.oauth.access_token_secret,
    function( error, data, response ) {
      if ( error ) {
        console.log( error );
        res.send( error )
      } else {
        console.log( JSON.parse( data ) );
        res.send( JSON.parse( data ) )
      }
    }
  )
} )


// function getProtectedEtsyResource( req, res, resourceURI, method ) {
//   console.log( user );
//   return oa.getProtectedResource(
//     "https://openapi.etsy.com/v2" + uri,
//     "GET",
//     req.session.oauth.access_token,
//     req.session.oauth.access_token_secret,
//     function( error, data, response ) {
//       if ( error ) {
//         console.log( error );
//         res.send( error )
//       } else {
//         console.log( data );
//         // res.send( data )
//       }
//     }
//   );
// }

module.exports = router
