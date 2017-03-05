'use strict'
// Order Resource
const express = require( 'express' );
const oauth = require( 'oauth' );
const knex = require( '../knex' );
const router = express.Router();
const axios = require( 'axios' )
const querystring = require( 'querystring' )
const Order = require( '../helpers/order-helper.js' ).Order
const Item = require( '../helpers/order-helper.js' ).Item
const timeoutQueue = require( '../helpers/order-helper.js' ).timeoutQ
// const getReceipts = require( '../helpers/order-helper.js' ).getReceipts
// const getTransactionItems = require( '../helpers/order-helper.js' ).getTransactionItems
const oa = require( '../helpers/auth-helper.js' ).oa



// var key = '0g2b7qc51yenv3co98av1m5k';
// var secret = 'zcb8oys17z';
//
// // Set domain and callback
// var domain = "http://localhost:3000/auth";
// var callback = "/callback";
//
// // Instantiate OAuth object
// let oa = new oauth.OAuth(
//   'https://openapi.etsy.com/v2/oauth/request_token?scope=listings_r%20transactions_r%20profile_r%20email_r',
//   'https://openapi.etsy.com/v2/oauth/access_token',
//   key,
//   secret,
//   '1.0A',
//   domain + callback,
//   'HMAC-SHA1'
// )

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
  // let uri = `/shops/${shop_id}/receipts/open`

  oa.getProtectedResource(
    "https://openapi.etsy.com/v2" + `/shops/${shop_id}/receipts/open`,
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
  let uri = `/shops/${shop_id}/listings/`
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


// BEGIN ORDER BUILDING
router.get( '/items', function( req, res, next ) {
  const shop_id = req.session.shop_id
  var orders = []
  var listingIdArr = []
  var uniqueListingIdArr = []
  var listings = []
  var imageListingIdArr = []
  var uniqueImageListingIdArr = []
  var images = []
  var itemsTrxData = []
  let time = 100



  new Promise( ( resolve, reject ) => {
      oa.getProtectedResource( //get transaction items
        "https://openapi.etsy.com/v2" + `/shops/${shop_id}/transactions?` + querystring.stringify( {
          limit: 100
        } ),
        "GET",
        req.session.oauth.access_token,
        req.session.oauth.access_token_secret,
        function( error, data, response ) {
          if ( error ) {
            console.log( error );
            return reject( error )
          } else {
            let rawItemsArr = JSON.parse( data ).results

            rawItemsArr.forEach( function( transaction ) {
              if ( transaction.shipped_tsz !== null ) {

                listingIdArr.push( transaction.listing_id )

                imageListingIdArr.push( [ transaction.listing_id, transaction.image_listing_id ] )

                let item = new Item( transaction.transaction_id, transaction.listing_id, transaction.receipt_id, transaction.title, transaction.quantity, transaction.price, transaction.variations, transaction.url )

                itemsTrxData.push( item )
              }

            } )
            uniqueListingIdArr = [ ...new Set( listingIdArr ) ];
            console.log( "unique_listings", uniqueListingIdArr.length );
            uniqueImageListingIdArr = [ ...new Set( imageListingIdArr ) ];
            resolve( [ itemsTrxData, uniqueListingIdArr, imageListingIdArr ] )
          }
        }
      )
    } )
    .then( ( data ) => {
      new Promise( ( resolve, reject ) => {
        oa.getProtectedResource( //get open receipts
          "https://openapi.etsy.com/v2" + `/shops/${shop_id}/receipts/open`,
          "GET",
          req.session.oauth.access_token,
          req.session.oauth.access_token_secret,
          function( error, data, response ) {
            if ( error ) {
              console.log( error );
              return reject( error )
            } else {
              console.log( "I did it!" );
              JSON.parse( data ).results.forEach( function( receipt ) {
                let order = new Order( receipt.receipt_id, receipt.creation_tsz, receipt.name, receipt.message_from_buyer, receipt.total_price )
                orders.push( order )
              } )
              console.log( 'orders' );
              resolve( orders )
            }
          }
        )
      } ).then( ( data ) => {
        let min = 0
        let max = 6
        let arrayChunk = uniqueListingIdArr.slice( min, max )
        // var listingQueue = function( arrayChunk ) {
        //   return Promise.all( arrayChunk.forEach( function( id ) {
        //     return new Promise( ( resolve, reject ) => {
        //       oa.getProtectedResource(
        //         "https://openapi.etsy.com/v2" + `/listings/${id}`,
        //         "GET",
        //         req.session.oauth.access_token,
        //         req.session.oauth.access_token_secret,
        //         function( error, data, response ) {
        //           if ( error ) {
        //             console.log( error );
        //             reject( error )
        //           } else {
        //             listings.push( JSON.parse( data ).results[ 0 ] )
        //             console.log( "* * *" );
        //             resolve( data )
        //
        //           }
        //         } )
        //     } )
        //   } ) )
        //
        // }
        return Promise.all( timeoutQueue( uniqueListingIdArr, function( arrayChunk = arrayChunk ) {
          Promise.all(
            arrayChunk.forEach( function( id ) {
              return new Promise( ( resolve, reject ) => {
                oa.getProtectedResource(
                  "https://openapi.etsy.com/v2" + `/listings/${id}`,
                  "GET",
                  req.session.oauth.access_token,
                  req.session.oauth.access_token_secret,
                  function( error, data, response ) {
                    console.log( arrayChunk );
                    if ( error ) {
                      console.log( error );
                      return reject( error )
                    } else {
                      listings.push( JSON.parse( data ).results[ 0 ] )
                      console.log( "* * *" );
                      return resolve( data )

                    }
                  } )
              } )
            } ) )

        } ) ).then( () => {
          res.send( [ "listings", listings ] )

        } )
      } )
    } )

  // .then( ( data ) => {
  //   let min = 0
  //   let max = 8
  //   let index = 0
  //   while ( min <= uniqueImageListingIdArr.length ) {
  //     let timer = setTimeout( function( min, max ) {
  //       let arrayChunk = uniqueImageListingIdArr.slice( min, max )
  //       Promise.all( arrayChunk.forEach( function( id ) {
  //         new Promise( ( resolve, reject ) => oa.getProtectedResource(
  //           "https://openapi.etsy.com/v2" + `/listings/${uniqueListingIdArr[index]}/images/${id}`,
  //           "GET",
  //           req.session.oauth.access_token,
  //           req.session.oauth.access_token_secret,
  //           function( error, data, response ) {
  //             index++
  //             if ( error ) {
  //               console.log( error );
  //               return reject( error )
  //             } else {
  //               // console.log( JSON.parse( data ) );
  //               console.log( "listing" );
  //               images.push( JSON.parse( data ) )
  //               resolve( data )
  //             }
  //           } ) )
  //       } ) )
  //     }, 2000, min, max )
  //     min += 10
  //     max += 10
  //     clearTimeout( timer )
  //   }
  // } )

  // } )

} )




// Promise.all( [ getReceipts(), getTransactionItems() ] )
//   .then( data => {
//     console.log( 'stuff' );
//   } )




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
