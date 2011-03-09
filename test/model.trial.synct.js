
var Trial = require ('../model/trial')
  , Test = require('../model/test')
  , Platform = require('../model/platform')
  , it = require('it-is')
  , hash = require('../utils').hash

  , platformAPI = function (e){
    it(e._id).equal(e.platform + '-' + e.version)
    it(e).has({
      command: it.typeof('string')
    , type: 'platform'
    })
  }

  var trialAPI = function (e,test,platform){

  
    it(e).has({
      filename: it.typeof('string')
    , adapter: it.matches(/node|expresso|asynct|synct|vows|nodeunit/)
    , platform: it.typeof('string')
    , command: it.typeof('string')
    , version: it.typeof('string')
    , status: it.matches(/init|complete/)
    })

  if(test){

    it(e).has({
      filename: test.filename
    , adapter: test.adapter
    , test: test._id
    })

  }

  if(platform){
  
    it(e).has({
      platform: platform.platform
    , command: platform.command
    , version: platform.version
    })
  
  }

  if(platform && test){
  
    it(e).property('_id',hash(JSON.stringify({filename: test.filename, platform: platform._id})))
  
  }

}
exports ['create a trial'] = function (){

  var test = new Test('/path/test.expresso.js')
    , plat = Platform.all()[0]
    , r = new Trial (test,plat)

  trialAPI(r,test,plat)
}

exports ['generate trials for every version'] = function (){

  var tests = [
        new Test('/path/test.expresso.js')
      , new Test('/path/test.vows.js')
      , new Test('/path/test.asynct.js')
      ]
    , platforms = Platform.all()

  it(Trial.generate(tests,platforms))
    .property('length', 3 * platforms.length)
    .every(trialAPI)

}

