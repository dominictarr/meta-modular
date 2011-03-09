
var Test = require ('../model/test')
  , it = require('it-is')
  , hash = require('../utils').hash

exports ['create a new test'] = function (){

  var t = new Test('/path/test.js','node')

  it(t).has({
    adapter: 'node'
  , filename: '/path/test.js'
  , _id: it.equal(hash('/path/test.js'))
  , type: 'test'
  })
}

exports ['create a new test & detect adapter'] = function (){

  var t = new Test('/path/test.vows.js')

  it(t).has({
    adapter: 'vows'
  , filename: '/path/test.vows.js'
  , _id: it.equal(hash('/path/test.vows.js'))
  , type: 'test'
  })

}
