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
const camelizeKeys = require( 'humps' ).camelizeKeys;


// BEGIN ORDER BUILDING
router.get( '/', function( req, res, next ) {
  const shop_id = req.session.shop_id
  var orders = []
  var listingIdArr = []
  var listingsQuery = []
  var listings = []
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
          if ( error ) {
            return reject( error )
          } else {
            let rawItemsArr = JSON.parse( data ).results

            rawItemsArr.forEach( function( transaction ) {
              if ( transaction.shipped_tsz === null ) {
                let ids = {
                  listingId: transaction.listing_id,
                  imageListingId: transaction.image_listing_id
                }
                if ( uniqueImageListingIdArr.indexOf( ids ) === -1 ) {
                  uniqueImageListingIdArr.push( ids )
                }

                let item = new Item( transaction.transaction_id, transaction.listing_id, transaction.receipt_id, transaction.title, transaction.quantity, transaction.price, transaction.variations, transaction.url )

                itemsTrxData.push( item )
              }

            } )
            console.log( uniqueImageListingIdArr );
            // query database for existing shop listing ids
            knex( 'listings' )
              .select( 'listing_id' )
              .where( 'shop_id', shop_id )
              .then( ( data ) => {
                // pull listing ids from database into an array
                let allDbListings = data.map( element => element.listing_id )
                // check if listings from current orders are already in the database and pull those listing ids into a separate array to be queried from the database
                for ( var i = 0; i < uniqueImageListingIdArr.length; i++ ) {
                  if ( allDbListings.indexOf( uniqueImageListingIdArr[ i ].listingId ) ) {
                    let splice = uniqueImageListingIdArr.splice( i, 1 )[ 0 ]
                    listingsQuery.push( splice.listingId )
                    i--
                  }
                }
                // get listing data from the database
                knex( 'listings' )
                  .select()
                  .whereIn( 'listing_id', listingsQuery )
                  .then( ( data ) => {
                    var dbListings = data.map( element => camelizeKeys( element ) )
                    console.log( dbListings );
                    // cross-reference listings with items and splice the items into the complete items array
                    addDbListingsToItems( dbListings, itemsTrxData, itemsComplete )
                    console.log( itemsComplete );


                  } )
                  .catch( err => next( err ) )
              } )
            resolve( itemsTrxData )
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

            timeoutQueue( uniqueImageListingIdArr, etsyListingRequests, getImages, listings )


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

                  // insert listing data into database
                  knex( 'listings' )
                    .insert( {
                      listing_id: itemsTrxLstData[ i ].listingId,
                      shop_id: shop_id,
                      processing_time: itemsTrxLstData[ i ].processingTime,
                      image_thumbnail_url: itemsTrxLstData[ i ].imageThumbnailUrl,
                      image_full_url: itemsTrxLstData[ i ].imageFullUrl
                    } )
                    .catch( ( err ) => next( err ) )

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
              arrayChunk.forEach( function( ids ) {
                let listingId = ids.listingId
                new Promise( ( resolve, reject ) => {
                  oa.getProtectedResource(
                    "https://openapi.etsy.com/v2" + `/listings/${listingId}`,
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
                let listingId = ids.listingId
                let imageId = ids.imageListingId
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

function addDbListingsToItems( dbListings, itemsTrxData, itemsComplete, index = 0 ) {
  if ( index === dbListings.length ) {
    return
  }
  for ( var i = 0; i < itemsTrxData.length; i++ ) {
    if ( itemsTrxData[ i ].listingId == dbListings[ index ].listingsId ) {
      // add listing data to item
      itemsTrxData[ i ].processingTime = dbListings[ index ].processingTime
      itemsTrxData[ i ].imageThumbnailUrl = dbListings[ index ].imageThumbnailUrl
      itemsTrxData[ i ].imageFullUrl = dbListings[ index ].imageFullUrl
      // move item to complete item array
      itemsComplete.push( itemsTrxData.splice( i, 1 )[ 0 ] )

      i--
    }
  }

  return addDbListingsToItems( dbListings, itemsTrxData, itemsComplete, ( index + 1 ) )
}





module.exports = router
