  var runner = require('meta-test/runner')
    , model = require('./model')({prefix: 'dev'})
    , qw = require('queue-width')
    
exports.run = function (trials,done) {
     
  qw(trials,1)
    .forEach(function (trial){
      var self = this 
      console.log(trial)
      runner.run(trial, function (error,report){
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")  
        console.log(trial._id, '--->',report.status)
        trial.report = report
        trial.status = 'complete'

        console.log(trial)

        model.trials.save(trial,function (){self.next()})
    },done)
  })
}

