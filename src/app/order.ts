export class Order {
  orderId: number
  orderDate: Date
  buyerName: string
  buyerMessage: string
  totalPrice: number
  items: Item[]
  shipBy: Date

  constructor(orderId: number, orderDate: Date, buyerName: string, buyerMessage: string, totalPrice: number, items: Item[], shipBy: Date) {
    this.orderId = orderId
    this.orderDate = orderDate
    this.buyerName = buyerName
    this.buyerMessage = buyerMessage
    this.totalPrice = totalPrice
    this.items = items
    this.shipBy = shipBy

  }
}

export class Item {
  item: any
  itemId: number
  orderId: number
  listingId: number
  title: string
  quantity: number
  price: string
  transactionUrl: string
  variationName1: string
  variationValue1: string
  variationName2: string
  variationValue2: string
  imageThumbnailUrl: string
  imageFullUrl: string
  processingTime: number

  constructor(itemId: number, orderId: number, listingId: number, title: string, quantity: number, price: string, transactionUrl: string, variationName1: string, variationValue1: string, variationName2: string, variationValue2: string, imageThumbnailUrl: string, imageFullUrl: string, processingTime: number) {
    this.itemId = itemId
    this.orderId = orderId
    this.listingId = listingId
    this.title = title
    this.quantity = quantity
    this.price = price
    this.transactionUrl = transactionUrl
    this.variationName1 = variationName1
    this.variationValue1 = variationValue1
    this.variationName2 = variationName2
    this.variationValue2 = variationValue2
    this.imageThumbnailUrl = imageThumbnailUrl
    this.imageFullUrl = imageFullUrl
    this.processingTime = processingTime
  }
}
