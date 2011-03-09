
var Nihop = require('nih-op')
  , model = require('./model')({prefix: 'dev'})
  , parser = new Nihop ()
    .option('adapter','a',1)
    .option('run','r',0)
//    .option('delete','d',0)

console.log(process.env.PWD)
/*
var mapped = 
parsed.args.map(function (e){
  var m = /^.+\.(\w+)\.\w+$/(e)
    , adapter = parsed.adapter || (m ? m[1] : 'node')
    , fn = path.join(process.env.PWD,e)
  return {_id: hash(fn), adapter: adapter, filename: fn, type: 'test'}
})

mapped.forEach(function (e){
  client.tests.save(e,function (err,x){
    if(err) throw err
    console.log(x)
  })
})

*/
process.argv.shift()
process.argv.shift()

var parsed = parser.parse(process.argv)
console.log(parsed)

if(!parsed.run){

  var Test = require('./model/test')
    , Platform = require('./model/platform')
    , Trial = require('./model/trial')

  model.initialize(save)

  var tests = parsed.args.map(function (e){return Test(e)})
    , platforms = Platform.all()
    , trials = Trial.generate(tests,platforms)

  function save (model){

    model.tests.save(tests,console.log)
    model.platforms.save(platforms,console.log)
    model.trials.save(trials,console.log)

  }

} else {
  model.trials.view('views/init',function (err,data){
    
    var trials = data.rows.map(function(e){ return e.value })
    console.log(trials)
    require('./supervisor').run(trials)
  })
}