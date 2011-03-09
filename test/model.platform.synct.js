
var Platform= require ('../model/platform')
  , it = require('it-is')
  , hash = require('../utils').hash

  , platformAPI = function (e){
    it(e._id).equal(e.platform + '-' + e.version)
    it(e).has({
      command: it.typeof('string')
    , type: 'platform'
    })
  }

exports ['check platforms'] = function (){

  var p = Platform.all()

  console.log(p)

  it(p).every(platformAPI)
}

/*
exports ['create a new test & detect adapter'] = function (){

  var t = new Test('/path/test.vows.js')

  it(t).has({
    adapter: 'vows'
  , filename: '/path/test.vows.js'
  , _id: it.equal(hash('/path/test.vows.js'))
  , type: 'test'
  })

}
*/