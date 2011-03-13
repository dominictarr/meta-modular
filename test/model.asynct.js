var model = require('../model') /*({prefix: 'test', modu})*/
  , it = require('it-is')

exports.__setup = function (test){
  model = model({host: 'localhost', port: 5984, prefix: 'test'}).initialize(test.done)
}

exports ['is setup ok'] = function (test){

  it(model).has({
    trials: it.ok()  
  })

  test.done()
}