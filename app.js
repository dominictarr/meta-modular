/*
 it seems like a good idea to render on the client side etc,
 but it's way simpler, to test etc, to render on the server side.
 
 NEXT: 
 
 post request API 
  - to npm (list installed modules)
  - to install
  - to add tests
 

 
 rendering for dependencies
 
 detecting dependency versions
 
 detecting npm package@version (simpler in new npm)


 
*/


/**
 * Module dependencies.
 */

var express = require('express')
  , Matrix = require('matrix')
  , render = require('render')
//  , client = require('./client')
  
  , client 
  , odm = require('./model')
  , npm = require('./npm')
  , Runner = require('./runner')
  , runner
var app = module.exports = express.createServer();

// Configuration

app.model = client

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.model = odm({prefix: 'dev'})

  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 

  app.model.initialize(function (err,model){
    model.modules.save(require('./model/platform').all(),console.log)
  })
});


app.configure('production', function(){
  app.model = odm()
  app.use(express.errorHandler()); 
});

npm = npm.model(app.model)
runner = new Runner(app.model)  
runner.start()
app.on('close',function (){runner.stop()})

/*
app.model.initialize(function (err,model){

  model.modules.save(require('./model/platform').all(),console.log)
})*/

// Routes

app.get('/', function(req, res){
//  client.trials.view('/trials/_design/views/_view/results', {} ,function (err,data){
  app.model.trials.view('views/results', {} ,function (err,data){

    var table = 
      Matrix.tabulate(data.rows,function (r,index){
        var k = 
          index ( r.value.platform
                , r.value.filename
                , '<a href=' + r.id + ' class=' + r.value.status + ">" + r.value.status + '</a>' )
      })

    res.render('table', table);
  })
});
app.get('/favicon.ico', function(req, res){
  
})

app.get('/add',function (req,res){

  if(!req.query || !req.query.pattern){

    res.write('<h1>expected query parameter pattern=package@version/test/*.js or similar</h1>')
    res.write('<pre>' + render(req.query,{multi: true}) + '</pre>')
    res.end()
  
  } else {

    npm.addTests(req.query,function (err,docs){
      
      res.write('<pre>' + render(err || docs,{multi: true}) + '</pre>')
      res.end()
    
    })
  }
})


app.get('/:id', function(req, res){

  app.model.trials.get(req.params.id,function (err,data){
     /*
      express@2.0.0rc adds support for .status field to render options
      my data had a field .status which was set to a string. 
      setting the http status to this broke it.
      
      eventually i figured it out, and then read the code and saw what it was doing.
      
      ah, again... tj has given me a code collision with data!
     
     */
    res.render('trial', {title: data._id, data: data}/* data/**/);
  })
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}