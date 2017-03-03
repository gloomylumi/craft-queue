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

exports.testString = "properly exported"

// module.exports = Order
// module.exports = testString
