export class Order {
  orderId: number
  orderDate: Date
  buyerName: string
  buyerMessage: string
  totalPrice: number
  items: any[]
  shipBy: Date

  constructor(orderId: number, orderDate: Date, buyerName: string, buyerMessage: string, totalPrice: number, items: any[], shipBy: Date) {
    this.orderId = orderId
    this.orderDate = orderDate
    this.buyerName = buyerName
    this.buyerMessage = buyerMessage
    this.totalPrice = totalPrice
    this.items = []
    this.shipBy = shipBy

  }
}
