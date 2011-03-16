
var it = require('it-is')
  , ctrl = require('ctrlflow')
  , model = require('../../model')({prefix: 'test'})
  , Runner = require('../../runner')
  , Test = require('../../model/test')
  , Platform = require('../../model/platform')
  , data = exports.data = {
      host: 'localhost'
    , port: 3001
    , tests: [
        new Test(__dirname + '/../examples/pass.node.js')
      , new Test(__dirname + '/../examples/fail.synct.js')
      , new Test(__dirname + '/../examples/error.node.js')
      ]
    , platforms: Platform.all().filter(function (e){
        return -1 != ['v0.2.6','v0.3.2','v0.4.2'].indexOf(e.version)
      })
    }

exports.database = function (done){
  ctrl.seq([
  function (){
    model.clean(this.next)
  },
  function (err){
    if(err) throw err
    model.modules.save(data.platforms.concat(data.tests),this.next)
  },
  function (err){
    if(err) throw err
      model.rollout(done)
  }])()
}

exports.tests = function (done){
  ctrl.seq([
  function (){
    exports.database(this.next)
  },
  function (){
    //app.model = model 
    var runner = new Runner(model)
    runner.start()
    var started = false
    runner.on('drain',function(){
      if(!started){
        runner.stop()
        started = true
        done(null,model)
      }
    })
  }]).throws()()
}
