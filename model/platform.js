
var platform = require('meta-test/platform')

exports.all = function (){
  return platform.list.map(function (e){
    var body = 
      { _id: 'node-' + e
      , platform: 'node'
      , version: e
      , command: platform.command(e)
      , type: 'platform'
      }
    return body
  })
}
