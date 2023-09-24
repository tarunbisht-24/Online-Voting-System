const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const adminRoutes = require('./api/routes/admin');
const userRoutes = require('./api/routes/user');
const indexRoutes = require('./api/routes/index');

app.set('views', __dirname + '/api/views');
app.set('view engine','ejs');

mongoose.connect(
    "mongodb+srv://user_01:Unknown..@cluster0-kbmtp.mongodb.net/test?retryWrites=true&w=majority"
           , { useNewUrlParser: true, useUnifiedTopology: true  }
    
);
mongoose.Promise = global.Promise;
app.use(morgan('dev'));

app.use('/public',express.static('api/public'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());


//Preventing CORS errors
//to Run Client and Server on different Systems
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',
    '*');
    //'Origin, X-Requested_With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods',
        'PUT, PATCH, POST, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


//Routes which should handle requests
app.use('/admin',adminRoutes);
app.use('/user',userRoutes);
app.use('/',indexRoutes);
//Handling Errors
app.use((req,res,next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
});


module.exports = app;
