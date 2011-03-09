//easyproxy.js
var connect = require('connect')
  , httpProxy = require('http-proxy');

module.exports = 
function EasyProxy(prefix,port,host){
  var regexp = RegExp ('^\/' + prefix)
  function proxy(req,res){
    req.url = req.url.replace(regexp,'') || '/'

    var proxy = new httpProxy.HttpProxy(req, res);
    proxy.proxyRequest(port, host, req, res);
  }
  return connect.router(function (app){
      app.get('/' + prefix,proxy)
      app.get('/' + prefix + '/*',proxy)
    })
}

