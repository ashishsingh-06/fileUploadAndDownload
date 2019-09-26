const mongodb = require('mongodb');
const url = 'mongodb://localhost:27017/FileSharing';

const config = {
  useUnifiedTopology: true,
  useNewUrlParser : true
};

exports.connect = (cb)=>{

    mongodb.connect(url,(err,db)=>{

          return cb(err,db);
    });
}
