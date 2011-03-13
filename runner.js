
var EventEmitter = require ('events').EventEmitter
  , metatest = require('meta-test/runner')

module.exports = Runner 

Runner.prototype = new EventEmitter
function Runner (model){
  var self = this
    , timeout
  self.running = false

  self.start = function (){
    console.log("START")
  
    self.running = true

    self.loop()
  }

  self.stop = function (){
    self.running = false
    clearTimeout(timeout)
  }

  self.loop = function (){
    model.trials.view('views/init', {limit: 1}, function (err,data){
      if(!self.running)
        return
      
      if(!data.length){
          self.emit('drain')
          timeout = setTimeout(self.loop,1e3)
        }
      else {

        var doc = data[0].value
        doc.status = 'started'
        model.trials.save(doc,function (err,_doc){
          if(err)//if another runner has started this already.
            return timeout = setTimeout(self.loop,100)

          doc._rev = _doc._rev

          self.emit('started',null,doc)
          metatest.run(doc,function (err,report){
            doc.report = report
            doc.status = 'completed'
            model.trials.save(doc,function (err){
              self.emit('completed',null,doc)
              return process.nextTick(self.loop)
            })
          })
        })
      }
    })
  }
}
