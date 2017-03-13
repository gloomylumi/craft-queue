'use strict'
// Order Resource
const express = require( 'express' );
const oauth = require( 'oauth' );
const knex = require( '../knex' );
const router = express.Router();
const querystring = require( 'querystring' )
const Order = require( '../helpers/order-helper.js' ).Order
const Item = require( '../helpers/order-helper.js' ).Item
const timeoutQueue = require( '../helpers/order-helper.js' ).timeoutQ
const oa = require( '../helpers/auth-helper.js' ).oa


// BEGIN ORDER BUILDING
router.get( '/', function( req, res, next ) {
  const shop_id = req.session.shop_id
  var orders = []
  var listingIdArr = []
  var uniqueListingIdArr = []
  var listings = []
  var imageListingIdArr = []
  var uniqueImageListingIdArr = []
  var images = []
  var itemsTrxData = []
  var itemsTrxLstData = []
  var itemsComplete = []




  new Promise( ( resolve, reject ) => {
      oa.getProtectedResource( //get transaction items
        "https://openapi.etsy.com/v2" + `/shops/${shop_id}/transactions?` + querystring.stringify( {
          limit: 200
        } ),
        "GET",
        req.session.oauth.access_token,
        req.session.oauth.access_token_secret,
        function( error, data, response ) {
          console.log( response );
          if ( error ) {
            return reject( error )
          } else {
            let rawItemsArr = JSON.parse( data ).results

            rawItemsArr.forEach( function( transaction ) {
              if ( transaction.shipped_tsz === null ) {

                listingIdArr.push( transaction.listing_id )

                imageListingIdArr.push( [ transaction.listing_id, transaction.image_listing_id ] )

                let item = new Item( transaction.transaction_id, transaction.listing_id, transaction.receipt_id, transaction.title, transaction.quantity, transaction.price, transaction.variations, transaction.url )

                itemsTrxData.push( item )
              }

            } )
            uniqueListingIdArr = [ ...new Set( listingIdArr ) ];
            console.log( "unique_listings", uniqueListingIdArr.length );
            uniqueImageListingIdArr = [ ...new Set( imageListingIdArr ) ];
            console.log( uniqueImageListingIdArr );
            resolve( [ itemsTrxData, uniqueListingIdArr, imageListingIdArr ] )
          }
        }
      )
    } )
    .then( ( data ) => {
      return new Promise( ( resolve, reject ) => {
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
                JSON.parse( data ).results.forEach( function( receipt ) {
                  let order = new Order( receipt.receipt_id, receipt.creation_tsz, receipt.name, receipt.message_from_buyer, receipt.total_price )
                  orders.push( order )
                } )
                resolve( orders )
              }
            }
          )
        } )
        .then( ( data ) => {

          ( function() {

            timeoutQueue( uniqueListingIdArr, etsyListingRequests, getImages, listings )


            function getImages( array ) {
              timeoutQueue( uniqueImageListingIdArr, etsyImageListingRequests, addListingDataToItems, listings )
            }

            function addListingDataToItems( listings, index = 0 ) {
              if ( itemsTrxData.length === 0 ) {
                return addImageDatatoItems( images )
              }
              if ( index > listings.length - 1 ) {
                itemsTrxLstData.push( itemsTrxData.shift() )
                return addListingDataToItems( listings, index )
              }
              for ( var i = 0; i < itemsTrxData.length; i++ ) {
                if ( itemsTrxData[ i ].listingId === listings[ index ].listing_id ) {
                  itemsTrxData[ i ].processingTime = listings[ index ].processing_max
                  itemsTrxLstData.push( itemsTrxData.splice( i, 1 )[ 0 ] )
                  i--
                }
              }
              index++
              return addListingDataToItems( listings, index )

            }

            function addImageDatatoItems( images, index = 0 ) {
              if ( itemsTrxLstData.length === 0 ) {
                return addItemsToOrders()
              }
              if ( index > images.length - 1 ) {
                itemsComplete.push( itemsTrxLstData.shift() )
                return addListingDataToItems( listings, index )
              }
              for ( var i = 0; i < itemsTrxLstData.length; i++ ) {
                if ( itemsTrxLstData[ i ].listingId === images[ index ].listing_id ) {
                  itemsTrxLstData[ i ].imageThumbnailUrl = images[ index ].url_170x135
                  itemsTrxLstData[ i ].imageFullUrl = images[ index ].url_fullxfull
                  itemsComplete.push( itemsTrxLstData.splice( i, 1 )[ 0 ] )
                  i--
                }
              }
              index++
              return addImageDatatoItems( images, index )
            }

            function addItemsToOrders( index = 0 ) {
              if ( itemsComplete.length === 0 ) {
                orders.forEach( function( element ) {
                  element.calcShipBy()

                } )
                res.send( [ orders, itemsComplete ] )
                return
              }
              if ( index > orders.length - 1 ) {
                orders.forEach( function( element ) {
                  element.calcShipBy()

                } )

                res.send( orders )
                return
              }
              for ( var i = 0; i < itemsComplete.length; i++ ) {
                if ( itemsComplete[ i ].orderId === orders[ index ].orderId ) {
                  orders[ index ].addItem( itemsComplete[ i ] )
                  itemsComplete.splice( i, 1 )
                  i--
                }
              }
              index++
              return addItemsToOrders( index )
            }

            function etsyListingRequests( arrayChunk = arrayChunk ) {
              arrayChunk.forEach( function( id ) {
                new Promise( ( resolve, reject ) => {
                  oa.getProtectedResource(
                    "https://openapi.etsy.com/v2" + `/listings/${id}`,
                    "GET",
                    req.session.oauth.access_token,
                    req.session.oauth.access_token_secret,
                    function( error, data, response ) {
                      if ( error ) {
                        console.log( error );
                        return reject( error )
                      } else {
                        listings.push( JSON.parse( data ).results[ 0 ] )
                        return resolve( listings )
                      }
                    } )
                } )
              } )
            }

            function etsyImageListingRequests( arrayChunk = arrayChunk ) {
              arrayChunk.forEach( function( ids ) {
                let imageId = ids[ 1 ]
                let listingId = ids[ 0 ]
                new Promise( ( resolve, reject ) => {
                  oa.getProtectedResource(
                    "https://openapi.etsy.com/v2" + `/listings/${listingId}/images/${imageId}`,
                    "GET",
                    req.session.oauth.access_token,
                    req.session.oauth.access_token_secret,
                    function( error, data, response ) {

                      if ( error ) {
                        console.log( error );
                        return reject( error )
                      } else {
                        images.push( JSON.parse( data ).results[ 0 ] )

                        return resolve( images )

                      }
                    } )
                } )
              } )
            }
          } )()
        } )
    } )
} )






module.exports = router
