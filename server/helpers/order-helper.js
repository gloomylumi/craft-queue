'use strict'
var exports = module.exports = {}
const express = require( 'express' );
const oa = require( './auth-helper' ).oa
const querystring = require( 'querystring' )
const Item = require( './order-helper' ).Item

const token =


  exports.Order = class Order {
    constructor( receipt_id, creation_tsz, name, message_from_buyer, total_price ) {
      this.orderId = receipt_id
      this.orderDate = new Date( parseInt( creation_tsz + "000" ) )
      this.buyerName = name
      this.buyerMessage = message_from_buyer
      this.totalPrice = total_price
      this.items = []

    }

    addItem( item ) {
      this.items.push( item )
    }
    calcShipBy() {
      let maxProcessing = 0
      for ( var i = 0; i < this.items.length; i++ ) {
        if ( this.items[ i ].processingTime > maxProcessing ) {
          maxProcessing = this.items[ i ].processingTime
        }
      }
      this.shipBy = new Date( this.orderDate.getFullYear(), this.orderDate.getMonth(), ( this.orderDate.getDate() + maxProcessing ) )
    }
  }

exports.Item = class Item {
  constructor( transaction_id, listing_id, receipt_id, title, quantity, price, variations, url ) {
    this.itemId = transaction_id
    this.orderId = receipt_id
    this.listingId = listing_id
    this.title = title
    this.quantity = quantity
    this.price = price
    this.transactionUrl = url
    if ( !variations[ 0 ] ) {
      this.variationName1 = null
      this.variationValue1 = null
    } else {
      this.variationName1 = variations[ 0 ].formatted_name
      this.variationValue1 = variations[ 0 ].formatted_value
    }
    if ( !variations[ 1 ] ) {
      this.variationName2 = null
      this.variationValue2 = null
    } else {
      this.variationName2 = variations[ 1 ].formatted_name
      this.variationValue2 = variations[ 1 ].formatted_value
    }
    this.imageThumbnailUrl = ''
    this.imageFullUrl = ''
    this.processingTime = 0
  }

}

// exports.getReceipts = new Promise( ( resolve, reject ) => {
//   oa.getProtectedResource( //get open receipts
//     "https://openapi.etsy.com/v2" + `/shops/${shop_id}/receipts/open`,
//     "GET",
//     req.session.oauth.access_token,
//     req.session.oauth.access_token_secret,
//     function( error, data, response ) {
//       if ( error ) {
//         console.log( error );
//         return reject( error )
//       } else {
//         console.log( "I did it!" );
//         JSON.parse( data ).results.forEach( function( receipt ) {
//           let order = new Order( receipt.receipt_id, receipt.creation_tsz, receipt.name, receipt.message_from_buyer, receipt.total_price )
//           orders.push( order )
//         } )
//         console.log( 'orders' );
//         resolve( orders )
//       }
//     }
//   )
// } )
//
// exports.getTransactionItems = new Promise( ( resolve, reject ) => {
//
//   oa.getProtectedResource( //get transaction items
//     "https://openapi.etsy.com/v2" + `/shops/${shop_id}/transactions?` + querystring.stringify( {
//       limit: 100
//     } ),
//     "GET",
//     token,
//     token_secret,
//     function( error, data, response ) {
//       if ( error ) {
//         console.log( error );
//         return reject( error )
//       } else {
//         var listingIdArr = []
//         var imageListingIdArr = []
//         var itemsTrxData = []
//         // console.log( JSON.parse( data ) );
//         // res.send( JSON.parse( data ) )
//         let rawItemsArr = JSON.parse( data ).results
//
//         rawItemsArr.forEach( function( transaction ) {
//           if ( transaction.shipped_tsz !== null ) {
//
//             listingIdArr.push( transaction.listing_id )
//
//             imageListingIdArr.push( transaction.image_listing_id )
//
//             let item = new Item( transaction.transaction_id, transaction.listing_id, transaction.receipt_id, transaction.title, transaction.quantity, transaction.price, transaction.variations, transaction.url )
//
//             itemsTrxData.push( item )
//           }
//
//         } )
//         listingIdArr = [ ...new Set( listingIdArr ) ];
//         imageListingIdArr = [ ...new Set( imageListingIdArr ) ];
//         resolve( [ itemsTrxData, listingIdArr, imageListingIdArr ] )
//       }
//     }
//   )
// } )
// let min = 0
// let max = 6
// let arrayChunk = uniqueListingIdArr.slice( min, max )
//
// let returnPromise = [];

//FOREACH AND AJAX STUIFF



// uniqueListingIdArr.forEach( id => {
//   setTimeout( () => {
//     returnPromise.push(
//       new Promise( ( resolve, reject ) => {
//         oa.getProtectedResource(
//           "https://openapi.etsy.com/v2" + `/listings/${id}`,
//           "GET",
//           req.session.oauth.access_token,
//           req.session.oauth.access_token_secret,
//           function( error, data, response ) {
//
//             if ( error ) {
//               console.log( error );
//               return reject( error )
//             } else {
//               listings.push( JSON.parse( data ).results[ 0 ] )
//
//               console.log( "* * *" );
//               return resolve( listings )
//
//             }
//           } )
//       } ) )
//   }, 200 )
// } )
// return Promise.all( returnPromise );

// timeoutQueue( uniqueListingIdArr, returnPromise, function( arrayChunk = arrayChunk ) {
//   returnPromise.push( [
//     arrayChunk.forEach( function( id ) {
//       new Promise( ( resolve, reject ) => {
//         oa.getProtectedResource(
// "https://openapi.etsy.com/v2" + `/listings/${id}`,
// "GET",
// req.session.oauth.access_token,
//   req.session.oauth.access_token_secret,
//           function( error, data, response ) {
//
//             if ( error ) {
//               console.log( 'uhoh', error );
//               return reject( error )
//             } else {
//               listings.push( JSON.parse( data ).results[ 0 ] )
//
//               console.log( "* * *" );
//               return resolve( listings )
//
//             }
//           } )
//       } )
//     } )
//   ] )
//
// } )
exports.timeoutQ = function timeoutQueue( array, etsyRequests, callback, callbackArray, min = 0, max = 6 ) {
  console.log( "recursion" );
  let arrayChunk = array.slice( min, max )
  if ( min > array.length ) {
    return callback( callbackArray )
  } else {
    etsyRequests( arrayChunk )
    min += 6
    max += 6
    return setTimeout( function() {
      timeoutQueue( array, etsyRequests, callback, callbackArray, min, max )
    }, 1000 )
  }
}
//
// exports.timeoutListing = function timeoutListing( array, callback, min = 0, max = 6 ) {
//   console.log( "recursion" );
//   let arrayChunk = array.slice( min, max )
//   if ( min > 11 ) {
//     return array
//   } else {
//     setTimeout( function() {
//       timeoutQueue( array, callback, min, max )
//     }, 1000 )
//     min += 6
//     max += 6
//     return callback( arrayChunk )
//   }
// }
// ( function() {
//   let delay = 100
//
//   // Then build up the following array in an iterative loop.
//
//   let reqs = uniqueListingIdArr.map( function( element ) {
//     return {
//       id: element,
//       delay: delay += 150
//     }
//   } )
//   // [ {
//   //   etsyReq: {} // Whatever you need in your request,
//   //   delay: += 1000
//   // } ]
//
//   let promises = []
//   let promisesStarted = false
//
//   reqs.forEach( sendEtsyReq ) // Implicit sendEtsyReq(reqPair)
//
//   // Must be hoisted, must be called by reference
//   function sendEtsyReq( reqPair ) {
//     let id = reqPair.id
//     let delay = reqPair.delay
//     console.log( delay );
//     promises.push( new Promise( function( resolve, reject ) {
//       setTimeout( makeAPromise, delay ) // fn to call, delay to callback
//
//       // startPromiseWatching()
//
//
//       function makeAPromise() {
//         oa.getProtectedResource(
//           `https://openapi.etsy.com/v2/listings/${id}`,
//           "GET",
//           req.session.oauth.access_token,
//           req.session.oauth.access_token_secret,
//
//           function( error, data ) {
//             if ( error ) {
//               console.log( error );
//               return resolve( `sendEtsyReq ${error}` )
//               // Used resolve not reject deliberately, so that all
//               // attempts will make the Promise.all work, even if one
//               // network call fails. What is in the results array
//               // will do its thing based on results gathered from successful
//               // calls
//             }
//
//             // You could console.log here so I split the work here.
//             console.log( "api response", Date.now() );
//             let result = JSON.parse( data ).results[ 0 ]
//             listings.push( result )
//           }
//         )
//       }
//     } ) )
//   }
//
//   // function startPromiseWatching() {
//   //   setTimeout( function() {
//   //     Promise.all( promises )
//   //       .then( function( values ) {
//   //         // Filter out the error strings from values
//   //         console.log( values );
//   //         values
//   //           .filter( ( v ) => typeof v !== 'string' )
//   //           .forEach( function( v ) {
//   //             // Do something with the results.
//   //           } )
//   //       } )
//   //   }, delay )
//   //
//   // }
// } )()
