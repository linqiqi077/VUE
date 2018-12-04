// mock框架，这里demo暂时没用到
require('mockjs')

var appData = require('./data.json')

var seller = {
  errno: 0,
  data: appData.seller
}
var goods = {
  errno: 0,
  data: appData.goods
}
var ratings = {
  errno: 0,
  data: appData.ratings
}

module.exports = {
  seller: seller,
  goods: goods,
  ratings: ratings
}
