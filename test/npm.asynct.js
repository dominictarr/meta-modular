//npm.asynct.js

var npm = require('../npm')
  , model = require('../model')({prefix: 'test'})
  , it = require('it-is')
  
exports.__setup = function (test){

  model.clean(function (err,_model){
    model = _model
    npm = npm.model(_model)
    test.done()
  })

}
  
exports ['glob'] = function (test){

//  npm.glob( __dirname + '/examples/test/*.js',function (err,list){
  npm.glob(__dirname + '/examples/*.js',function (err,list){
  it(err).equal(null)
  it(list).has(
    'error.node.js fail.node.js fail.synct.js pass.node.js'
    .split(' ')
    .map(function (e){
      return __dirname + '/examples/' + e
    }))

    test.done()
  })
}


exports ['addTests'] = function (test){

//  npm.glob( __dirname + '/examples/test/*.js',function (err,list){
  npm.addTests({pattern:__dirname + '/examples/*.js'},function (err,list){
  it(err).equal(null)
  
  console.log(list)
  model.modules.get(
    list.map(function (e){
    return e.id
    }),
    function (err,docs){
      it(docs.map(function (e){
        return e
        }))
        .has(
          'error.node.js fail.node.js fail.synct.js pass.node.js'
          .split(' ')
          .map(function (e){
            return {filename: __dirname + '/examples/' + e}
          }))
        .every(it.has({
            type:'test'
          , adapter: it.matches(/node|synct|asynct|expresso|vows|nodeunit/)
          }))

    test.done()
  })
  /*
    idea: since i'm doing it like, all the time...
    
      function to make map macros...
      
      mapper('.property[0].etc') -> a function to return property[0].etc of every item
      and while we're at it...
      'string #{.property} etc...' insert properties into strings...
  */
  
  //test.done()
  
/*  it(list).has(
    'error.node.js fail.node.js fail.synct.js pass.node.js'
    .split(' ')
    .map(function (e){
      return __dirname + '/examples/' + e
    }))

    test.done()*/
  })
}
