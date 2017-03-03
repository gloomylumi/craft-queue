'use strict'
var exports = module.exports = {}


exports.Order = class Order {
  constructor( receipt_id, creation_tsz, name, message_from_buyer, total_price ) {
    this.orderId = receipt_id
    this.orderDate = new Date( creation_tsz )
    this.buyerName = name
    this.buyerMessage = message_from_buyer
    this.totalPrice = total_price
    this.items = []
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
  }
}
