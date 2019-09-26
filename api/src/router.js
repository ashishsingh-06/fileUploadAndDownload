const packageJson = require('../../package.json');
const path = require('path');
const _ = require('lodash');
const FileModel = require('./models/file');
const mongodb = require('mongodb');

class AppRouter{

      constructor(app,database){
        this.app = app;
        this.db = database;
        this.setupRouters();
      }

      setupRouters(){

          const app = this.app;
          const db = this.db;

          //get route
          app.get('/',(req,res,next)=>{
              return res.status(200).json({
                version: packageJson.version,
                message: "hello"
              });
          });
          // get route

          const uploadDir = app.get('stroageDir');
          const upload = app.get('upload');

          //post route
          app.post('/api/upload',upload.array('files'),(req,res,next)=>{

              //  console.log('received file uploads',req.files);
               const files = _.get(req,'files',[]);
               let fileModels = [];

               _.each(files,(fileObject)=>{

                  const newFile = new FileModel(app).initWithObject(fileObject).toJson();
                  fileModels.push(newFile);
               });


               if(fileModels.length){

                    db.collection('files').insertMany(fileModels,(err,result)=>{

                        if(err)
                        {
                          return res.status(503).json({
                            erorr: {
                              message: 'unable to save your file',
                            }
                          });
                        }else {

                            console.log('save file with result',err,result);
                              return res.json({
                                files: fileModels
                              });
                        }

                    });
               }
               else {
                  return res.status(503).json({
                      error : {
                        message : 'No file present, Upload a file'
                      }
                  });
               }


              //  const files = req.files;
          });
          // post route

          //download route
          app.get('/api/download/:id',(req,res,next)=>{

                const fileId = req.params.id;

                db.collection('files').find({_id: mongodb.ObjectID(fileId)}).toArray((err,result)=>{

                    const fileName = _.get(result,'[0].fileName');
                  if(err|| !fileName)
                  {
                      return res.status(503).json({
                            error: {
                              message : 'unable to download file'
                            }
                      });
                  }
                  else {

                    const filePath = path.join(__dirname,'/storage',fileName);

                    return res.download(filePath,fileName,(err)=>{

                        if(err){

                          return res.status(404).json({
                              error : {
                                message: "File not found"
                              }
                          });

                        }
                        else {
                          console.log('file downloaded');
                        }

                    });

                  }

                });
                //console.log(filePath);


          });
          //download route


          //email route
          app.post('/api/email',(req,res,next)=>{

          });
      }
}


module.exports = AppRouter;
