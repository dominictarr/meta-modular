/**
 * Module dependencies.
 */

var app = require('../app')
  , it = require('it-is')
  , request = require('request')
  , host = 'localhost'
  , port = 3001
  , client = require('../client')
  , queue = require('queue-width')
/*
need setup and teardown support for asynct.

also, need to dump error if process is hanging.

response assertion for it-is?

it would mean implementing async assertions.

*/

function get(path,cb){
  request({uri: 'http://' + host + ':' + port + path},cb)
}

exports.__setup = function (test){
  console.log("SETUP")
  app.listen(port,host,test.done)
}

exports ['GET /'] = function(test){

  get('/',function (err,res,body){
//    console.log(err)  
  //  console.log(res)  
    
    it(err).equal(null)
    it(res).has({
      statusCode: 200
    , headers: { 'content-type': 'text/html' }
    })

    test.done()
    console.log("DONE")
  })
}

exports ['GET /:id'] = function(test){

  client.trials.view('/trials/_design/views/_view/results',function (err,data){
    queue(data.rows, 100).forEach(function (e){
      var self = this
      get('/' + e.id,function (err,res,body){
        self.next()
      })
    },test.done)
  })
}

exports.__teardown = function (test){
  app.close()
  test.done()
} 
