//easy-proxy.expresso.js

var it = require ('it-is')
  , EasyProxy = require('meta-modular/easy-proxy')
  , connect = require('connect')
  , request = require('request')

exports ['test exits naturally'] = function (test){

  var message = 'request successfully proxied! -> ' + Math.random()

  var proxied = 
  connect.createServer(
    function (req,res){
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write(JSON.stringify({
        message: message
      , url: req.url 
      }))
      res.end()
    }
  )
  
  proxied.listen(9000,'localhost',c)

  function c (){

    var server = 
      connect.createServer(EasyProxy ('9k',9000,'localhost'))
    server.listen(8000,c)

    function c(){
  
      request({uri: 'http://localhost:8000/9k'}, function (error,res,body){
        body = JSON.parse(body)
        it(body).has({
          message: message
        , url: '/'
        })
        
        request({uri: 'http://localhost:8000/9k/hello'},function (error,res,body){
          body = JSON.parse(body)
          it(body).has({
            message: message
          , url: '/hello'
          })
          proxied.close()
          server.close()
          test.done()
          process.exit()//shouldn't have to do this. this is a problem with http-proxy, a dependency of easy proxy.
        })
      })
    }
  }
}


