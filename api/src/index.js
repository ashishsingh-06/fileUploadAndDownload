const http = require('http');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const multer = require('multer');
const connect = require('./database');
const AppRouter = require('./router');
const nodemailer = require('nodemailer');
const smtpConfig = require('./config');
//setup email
const email = nodemailer.createTransport(smtpConfig);


// File storage config
const storageDir = path.join(__dirname,'src','..','storage');
const storageConfig = multer.diskStorage({

    destination: (req,file,cb)=>{
        cb(null,storageDir)
    },
    filename: (req,file,cb)=>{
      cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({storage: storageConfig});
// File storage config

const PORT = 4000;
const app = express();
app.server = http.createServer(app);

app.use(morgan('dev'));

app.use(cors({
    exposedHeaders: "*"
}));

app.use(bodyParser.json({
    limit: '50mb'
}));

app.set('root',__dirname);
app.set('storageDir',storageDir);
app.set('upload',upload);
app.email = email;


// connecting to database

connect.connect((err,db)=>{

        if(err)
        {
          console.log(err);
          throw err;
        }

        app.set('db',db);

        let database = app.get('db');
      //  console.log(database);
        // init router

        new AppRouter(app,database);

        app.server.listen(process.env.PORT || PORT, ()=>{
            console.log(`app is running on ${app.server.address().port}`);
        });
});

module.exports = app;
