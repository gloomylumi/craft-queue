import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})
export class OrderItemComponent implements OnInit {
  @Input()
  item: any
  itemId: number
  orderId: number
  listingId: number
  title: string
  quantity: number
  price: number
  transactionUrl: string
  variationName1: string
  variationValue1: string
  variationName2: string
  variationValue2: string
  imageThumbnailUrl: string
  imageFullUrl: string
  processingTime: number
  constructor() {
    // this.itemId = item.itemId
    // this.orderId = item.orderId
    // this.listingId = item.listingId
    // this.title = item.title
    // this.quantity = item.quantity
    // this.price = item.price
    // this.transactionUrl = item.transactionUrl
    // this.variationName1 = item.variationName1
    // this.variationValue1 = item.variationValue1
    // this.variationName2 = item.variationName2
    // this.variationValue2 = item.variationValue2
    // this.imageThumbnailUrl = item.imageThumbnailUrl
    // this.imageFullUrl = item.imageFullUrl
    // this.processingTime = item.processingTime
  }

  ngOnInit() {
    console.log(this.item)
  }

}
