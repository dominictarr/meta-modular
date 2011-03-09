var cm = require('cradle-model')

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
                if(doc.status == 'complete')
                 emit(doc.report.status, 
                  { filename: doc.filename
                  , platform: doc.platform + '-' + doc.version
                  , status: doc.report.status } );
              }
            }
          }
        }
      ],
      tests: [
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
      ]
    }
  }
  
  obj.host = _obj.host 
  obj.port = _obj.port 
  obj.prefix = _obj.prefix || ''

  return cm(obj)
}