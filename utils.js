//utils.js

var crypto = require('crypto')

exports.hash = function (input){

  var h = crypto.createHash('md5')
  h.update(input)
  return h.digest('hex')
}
