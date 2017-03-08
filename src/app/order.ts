export class Order {
  orderId: number
  orderDate: Date
  buyerName: string
  buyerMessage: string
  totalPrice: number
  items: any[]
  shipBy: Date

  constructor(orderId: number, orderDate: Date, name: string, message_from_buyer: string, total_price: number, items: any[], shipBy: Date) {
    this.orderId = orderId
    this.orderDate = orderDate
    this.buyerName = name
    this.buyerMessage = message_from_buyer
    this.totalPrice = total_price
    this.items = []
    this.shipBy = shipBy

  }
}
