'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;



mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_blog',{
    useUnifiedTopology: true,
    useNewUrlParser: true,})
            .then(()=>{
                console.log("conexion exitosaa breo!!!");
                

                //crear server y escuchar peticiones http
               app.listen(port, () =>{
                    console.log('Servidor Corriendo en http://localhost:'+port);
                })
            })