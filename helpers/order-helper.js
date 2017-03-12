'use strict'
var exports = module.exports = {}
const express = require( 'express' );
const oa = require( './auth-helper' ).oa
const querystring = require( 'querystring' )
const Item = require( './order-helper' ).Item




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
