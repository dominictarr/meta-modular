/**
 * Module dependencies.
 */

var app = require('../app')
  , it = require('it-is')
  , example = require('./lib/example-db')
  , request = require('request')
  , host = 'localhost'
  , port = 3001
  , ctrl = require('ctrlflow')
  , model 

exports.__setup = function (test){
  example.tests(function(err,_model){
    model = app.model = _model
    app.listen(port,host,test.done)
  })
}

function get(path,cb){
  request({uri: 'http://' + host + ':' + port + path},cb)
}


exports ['GET /'] = function(test){

  get('/',function (err,res,body){

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

  model.trials.view('views/results',function (err,data){
    ctrl.width(data.rows, 1).forEach(function (e){
      var next = this.next
      get('/' + e.id,function (err,res,body){
          it(err).equal(null)
          it(res).has({
            statusCode: 200
          , headers: { 'content-type': 'text/html' }
          })
        next()
      })
    },test.done)
  })
}

exports.__teardown = function (test){
  app.close()
} 
//*/

