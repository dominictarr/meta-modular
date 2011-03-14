var odm = require('couchlegs')
  , ctrl = require('ctrlflow')
  , Trial = require('./trial')
  
module.exports = 
function init(_obj){
  var obj = 
  { models: {
      trials: [
        { _id: '_design/views'
        , views: {
            init: {
              map: function(doc) {
                if(doc.status == 'init')
                 emit(null, doc);
              }
            },
            results: {
              map: function(doc) {
                if(doc.status != 'init'){
                 var status = doc.report ? doc.report.status : doc.status
                 emit(status, 
                  { filename: doc.filename
                  , platform: doc.platform + '-' + doc.version
                  , status: status} );                  
                }
              }
            }
          }
        }
      ],
      modules: [
        { _id: '_design/platforms'
        , views: {
            'new': {
              map: function(doc) {
                if(doc.type == 'platform' && !doc.rolledout)
                  emit(doc._id, doc);
              }
            },
            'all': {
              map: function(doc) {
                if(doc.type == 'platform' && doc.rolledout)
                  emit(doc._id, doc);
              }
            }
          }
        },
        { _id: '_design/tests'
        , views: {
            'new': {
              map: function(doc) {
                if(doc.type == 'test' && !doc.rolledout)
                  emit(doc._id, doc);
              }
            },
            'all': {
              map: function(doc) {
                if(doc.type == 'test' && doc.rolledout)
                  emit(doc._id, doc);
              }
            }
          }
        }
      ]
/*      tests: [
        { _id: '_design/views'
        , views: {
            all: {
              map: function(doc) {
                if(doc.type == 'test')
                  emit(doc._id, doc);
              }
            }
          }
        }
      ],
      platforms: [
        { _id: '_design/views'
        , views: {
            all: {
              map: function(doc) {
                if(doc.command && doc.platform && doc.version)
                  emit(doc._id, doc);
              }
            }
          }
        }
      ]*/
    }
  }
  
  obj.host = _obj.host 
  obj.port = _obj.port 
  obj.prefix = _obj.prefix || ''

  var model = odm(obj)
  
  model.rollout = function (done){
    var g = ctrl.group()
        
    /*
      for scalability, do this in two stages
      
      load new, and only if there are new items, load old.
    
    */
        
    model.modules.view('platforms/new',g())
    model.modules.view('platforms/all',g())
    model.modules.view('tests/new',g())
    model.modules.view('tests/all',g())

    function ex (data){
      console.log(data)
      return data.rows.map(function (e){
        e.value.rolledout = true
        return e.value
      })
    }

    g.done(function (err,data){
      var platforms = {
            new:ex(data[0][1])
          , all:ex(data[1][1])
          }
        , tests = {
            new:ex(data[2][1])
          , all:ex(data[3][1])
          }
      var trials = 
        Trial.generate(tests.new,platforms.all)
        .concat(Trial.generate(tests.all,platforms.new))
        .concat(Trial.generate(tests.new,platforms.new))
      var g = ctrl.group()

      model.trials.save(trials,function (){
        model.modules.save(platforms.new,g())
        model.modules.save(tests.new,g())
      })
      
      g.done(function (err,res){
        done(err,trials.length)      
      })
    })
  }
  
  return model
}