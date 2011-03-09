
exports = module.exports = Trial

var hash = require('../utils').hash
  , matrix = require('matrix')({
    cell: Trial
  })

function Trial (test, platform){

  if(!(this instanceof Trial)) return new Trial (test, platform)
    
     this.command = platform.command
     this.version = platform.version
     this.platform = platform.platform
     this.filename = test.filename
     this.adapter = test.adapter
     this.status = 'init'
     this._id = hash(JSON.stringify({filename: test.filename, platform: platform._id}))
     this.test = test._id

}

Trial.generate = function (tests,platforms){

  return matrix.product(tests,platforms)
  
}

  
