const _  = require('lodash');

class FileModel{

    constructor(app)
    {
      this.app = app;
      this.model = {

            fileName:null,
            originalName: null,
            mimeType: null,
            size:null,
            created: Date.now(),
        }
    }

    initWithObject(object)
    {
        this.model.fileName = _.get(object,'filename');
        this.model.originalName = _.get(object,'originalname');
        this.model.mimeType = _.get(object,'mimetype');
        this.model.size = _.get(object,'size');
        this.model.created = Date.now();

        return this;
    }

    toJson(){
        return this.model;
    }

    save(callback)
    {
      const db = app.get('db');
      db.collection('files').insertOne(this.model, (err,result)=>{
           return callback(err,result);
      });
    }
}

module.exports = FileModel;
