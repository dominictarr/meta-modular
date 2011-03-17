
module.exports = Test

var hash = require('../utils').hash

function Test (filename, adapter){
  if(!(this instanceof Test)) return new Test(filename,adapter)

  var m = /^.+\.(\w+)\.\w+$/(filename)
  
  if(!adapter && !m && !m[1])
    throw new Error("test: " + filename + " did not specify a adapter (/testfile.[adapter].js) or call Test(filename,adapter)")

  this.filename = filename
  this.adapter = adapter || m[1]
  this._id = hash(filename)
  this.type = 'test'
}

