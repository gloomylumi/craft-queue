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
      this.orderDate = new Date( creation_tsz )
      this.buyerName = name
      this.buyerMessage = message_from_buyer
      this.totalPrice = total_price
      this.items = []
    }

    addItem( item ) {
      this.items.push( item )
    }
    get shipBy() {
      let maxProcessing = 0
      for ( var i = 0; i < this.items.length; i++ ) {
        if ( this.items[ i ].processingTime > maxProcessing ) {
          maxProcessing = this.items[ i ].processingTime
        }
      }
      return new Date( this.orderDate.getFullYear(), this.orderDate.getMonth, ( this.orderDate.getDate() + maxProcessing ) )
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
exports.timeoutQ = function timeoutQueue( array, callback, min = 0, max = 6 ) {
  console.log( "recursion" );
  let arrayChunk = array.slice( min, max )
  if ( min > 11 ) {
    return array
  } else {
    setTimeout( function() {
      timeoutQueue( array, callback, min, max )
    }, 1000 )
    min += 6
    max += 6
    return callback( arrayChunk )
  }
}

exports.timeoutListing = function timeoutListing( array, callback, min = 0, max = 6 ) {
  console.log( "recursion" );
  let arrayChunk = array.slice( min, max )
  if ( min > 11 ) {
    return array
  } else {
    setTimeout( function() {
      timeoutQueue( array, callback, min, max )
    }, 1000 )
    min += 6
    max += 6
    return callback( arrayChunk )
  }
}
