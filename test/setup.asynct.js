//setup.asynct.js

var model = require('../model')({prefix: 'install-test'})
  , Platform = require('../model/platform')
  , Test = require('../model/test')
  , ctrl = require('ctrlflow')
  , it = require('it-is')
  , tests = [
      new Test('meta-modular/test/examples/simple.node.js')
    , new Test('meta-modular/test/examples/simple2.node.js')
    , new Test('meta-modular/test/examples/simple3.node.js')
    ]
  , platforms = Platform.all().filter(function (e){
      return -1 != ['v0.2.6','v0.3.2','v0.4.2'].indexOf(e.version)
    })
  
exports.__setup = function (test){

  model.clean(test.done)

}

/*
  IDEA: instead of tests, platforms dbs, and listeners, 
  use one bd, 'modules' 
  and a status: init / setup, or rolledout: false / true
  
  then views that get all platforms, and all tests
  
  with one DB listeners will be easier to reason about.



*/

function assertSame(db,local,field){
  function cmp (x,y){
    return x[field] == y[field] ? 0 : ( x[field] < y[field] ? 1 : -1 )
  }
  it(db.sort(cmp)).has(local.sort(cmp))
}

exports['add platforms'] = function (test){

  var g = ctrl.group()

  ctrl.seq([
    function (){
      model.modules.save(platforms,this.next)
    },
    function next(err){
    it(err).equal(null)

    model.modules.view('platforms/new',this.next)
    },
    function (err,data){
      var saved = data.rows.map(function (e){return e.value})
      it(saved).has(platforms)

      model.rollout(this.next)
    },
    function (err,count){
      model.modules.view('platforms/all',this.next)
    },
    function (err,data){
      var saved = data.rows.map(function (e){return e.value})

      assertSame(saved,platforms,'version')
      test.done()    
    }])()
  /*
  suddenly, I can't belive i didn't start using a control flow lib earlier.    
  */
}

exports ['add tests'] = function (test){
  var g = ctrl.group()


  ctrl.seq([
    function (){
      model.modules.save(tests,this.next)
    },
    function (err){
      model.rollout(this.next)
    },
    function (err,count){
      model.modules.view('tests/all',this.next)
    },
    function (err,data){
      it(err).equal(null)
      var saved = data.rows.map(function (e){return e.value})
      assertSame(saved,tests,'filename')

      test.done()    
    }])()
}

exports ['check trails'] = function (test){
  
  model.trials.view('views/init', function (err,data){
    it(err).equal(null)
    var init = data.rows.map(function (e){return e.value})
    it(init).property('length', tests.length * platforms.length)
    console.log(init)
  
    test.done()
  }) 
}
