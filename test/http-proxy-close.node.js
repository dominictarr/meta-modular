  var http = require('http'),
      httpProxy = require('http-proxy'),
      request = require('request')

  // Create your proxy server
  var proxied = 
    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
      res.end();
    })
    
  proxied.listen(9000,c)

  function c(){
    console.log('created server to proxy')

    var proxy = 
      httpProxy.createServer(9000, 'localhost')

/*    //if proxy is a normal server, it will close properly.  
    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
      res.end();
    })*/

    proxy.listen(8000,c)
    
    function c(){
      console.log('created proxy')
    
      request({uri:'http://localhost:8000'},function (err,res,body){
        proxied.close()
        proxy.close()//something is left listening and doesn't properly close!
        console.log('...node should exit now')
      })
    
    }
  
  }