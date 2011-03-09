//client

var CouchClient = require('couch-client')

var url = 'http://localhost:5984'

exports.trials = CouchClient(url + '/trials')
exports.tests = CouchClient(url + '/tests')
exports.platforms = CouchClient(url + '/platforms')

/*
var Couch = require('couch-client')

var ex = Couch('http://localhost:5984/example')

ex.changes(10,function (err,data){
  console.log(data, "changed!!!!")
})

ex.save(
    { _id:'testid1'
    , values: 'asdfhklasdflsadjfldks' + Math.random()
    , testvalue:'atest' }
  , function (err,result) {
      if(err) throw err
  
    console.log(result, "SAVED")


ex.save(
    { _id:'testid1' + Math.random()
    , values: 'XXXXXXXXXXX'+ Math.random()
    , testvalue:'atest' }
  , function (err,result) {
      if(err) throw err
  
    console.log(result, "SAVED")

    })

    })

*/