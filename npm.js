var glob = require('glob')
  , Test = require('./model/test')

function setModel(model){
var exports = {model: setModel}
  exports.glob = function (pattern,cb){

    glob.glob(pattern,cb)
  }

  exports.installed = function (){

    //ls npm dir for package@version
  }


  //calls back with the list of tests.
  exports.addTests = function (opts,cb){

    glob.glob(opts.pattern,function (err,list){
      model.modules.save(      
        list.map(function (e){
          return new Test(e,opts.adapter)
        }),
        function (err,data){
          cb(err,data)
          model.rollout(console.log)
        
        })
        
    })
  }

  /*
  the following will callback with a reference 
  to a link to request the status of the installation.

  i mean: install package in a child process, and save the std{out,err} in couch.

  return a the id of what the install log will be (i.e. install:package@version

  */

  exports.install = function (opts,cb){

  //{name: package, version: version}

  }

  exports.pull = function (opts,cb){

  //git url {git: url}

  //installs your git repo to username/project name

  //then: add tests, like username/project/test/*.js

  }

return exports
}
setModel.model = setModel

module.exports = setModel (require('./model'))