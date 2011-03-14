var model = require('../model')({prefix: 'install-test'})
  , Platform = require('../model/platform')
  , Test = require('../model/test')
  , ctrl = require('ctrlflow')
  , it = require('it-is')
  , Runner = require('../runner')
  , example = require('./lib/example-db')
/*
  , tests = [
      new Test(__dirname + '/examples/pass.node.js')
    , new Test(__dirname + '/examples/fail.synct.js')
    , new Test(__dirname + '/examples/error.node.js')
    ]
  , platforms = Platform.all().filter(function (e){
      return -1 != ['v0.2.6','v0.3.2','v0.4.2'].indexOf(e.version)
    })
*/
exports.__setup = function (test){

  example.database(test.done) 

}


exports['start trials'] = function (test){

  //start runner
  
  //emits started event, emits completed event
  
  //emits drain event.
  
  var runner = new Runner(model)

  runner.start()

  runner.on('started', function (err,doc){
    it(err).equal(null)
    console.log('start:', doc.filename)
  })
  runner.on('completed', function (err,doc){
    it(err).equal(null)
    console.log
      ( 'completed:'
      , doc.filename
      , 'on'
      , doc.version
      , '-->'
      , doc.report.status )
  })
  runner.on('drain', function (err,doc){
    it(err).equal(null)
    console.log('finished all tests')
    runner.stop()
    model.trials.view('views/results',function (err,data){
      console.log(data)    
    
      it(data.rows)
        .every(function (e){
          it(e.value).property('status',it.matches(/success|failure|error/))
        })
        .property('length',example.data.platforms.length * example.data.tests.length)
        
      test.done()
    })
    //check that all the tests are completed.
  })
}
