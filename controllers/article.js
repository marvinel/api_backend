'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');




var Article = require('../models/article');
const { exists } = require('../models/article');

var controller = {

   datosCurso: (req, res) =>{
        //var hola = req.body.hola;
    
        return res.status(200).send({
            curso: 'el de marvin perri',
            autor: 'El propio marvin',
            //hola
        });
    },

    
    Test: (req, res)=>{
        return res.status(200).send({
            message: 'soy la accion test de mi controller'
        });
    },

    save:(req, res)=>{
        //Recoger parametros por post
        var params = req.body;
        console.log(params);

        //validar datos (libreria Validator)
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'faltan datos perri'
            });
        }

        if(validate_title && validate_content){
        
        //Crear el objeto a guardar
            var article = new Article();


        //Asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;

        //guardar
        
        article.save((err,articleSaved)=>{
            if(err || !articleSaved ){
                return res.status(404).send({
                    status:'error',
                    message:'article no guardado !'
                });
            }
        //devolver respuesta
            return res.status(200).send({
            status:'success',
            article
            });

        })


        }else{
            return res.status(200).send({
                status: 'error',
                message: 'los datos nel validate'
            });
        }

    },

    getArticles: (req, res)=>{
        
        var query =Article.find({});

        var last = req.params.last;
        if(last || last != undefined){
            query.limit(2);
        }

        query.sort('-_id').exec((err,articles)=>{

            if(err){
                return res.status(500).send({
                    status:'error',
                    message: 'Error al devolver los articulos!!!'
                });
            }

            if(!articles){
                return res.status(404).send({
                    status:'error',
                    message: 'no hay articulos'
                });
            }

            return res.status(200).send({
                status:'success',
                articles
            });
        });


        
    },

    getArticle: (req, res) =>{
        var articleId = req.params.id;

        if(!articleId || articleId == null){
            return res.status(404).send({
                status:'error',
                message: 'no hay articulos'
            });
        }

        Article.findById(articleId, (err, article)=> {

            if(err || !article){
                return res.status(404).send({
                    status:'error',
                    message: 'no hay articulo'
                });
            }

            return res.status(200).send({
                status:'success',
                article
            });
        })


    },

    update: (req, res)=>{
        var articleId = req.params.id;
        var params =req.body;

        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        }catch(err){

        
            return res.status(404).send({
                status:'error',
                message: 'falta perrito'
            });
        }

        if(validate_title && validate_content){
            Article.findOneAndUpdate({_id: articleId}, params, {new:true}, (err,articleUpdated) => {
                if(err){
                    return res.status(500).send({
                        status:'error',
                        message: 'error al actualizar'
                    });
                }

                if(!articleUpdated){
                    return res.status(500).send({
                        status:'error',
                        message: 'no se encuentra el articulo'
                    });
                }

                return res.status(200).send({
                    status:'success',
                    article: articleUpdated
                });
            });


        }else{
            return res.status(200).send({
                status:'error',
                message: 'la validacion no es correcta'
            });
        }

    },

    delete: (req, res)=>{
        var articleId = req.params.id;

        Article.findOneAndDelete({_id: articleId}, (err, articleRemoved)=>{
            if(err){
                return res.status(500).send({
                    status:'error',
                    message: 'error al borrar'
                });
            }
            if(!articleRemoved){
                return res.status(500).send({
                    status:'error',
                    message: 'error al borrar'
                });
            }
            return res.status(200).send({
                status:'success',
                article: articleRemoved
            });
        })

    },

    upload: (req, res)=>{

        //configuar el modulo connect multiparty(hecho)

        //recoger el fichero de la peticion
        var file_name='imagen no subida...';

        if(!req.files){
            return res.status(404).send({
                status:'error',
                message: file_name
            });
        }
        //conseguir el nombre y la extension del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        var file_name = file_split[2];
        var extension_split = file_name.split('.');
        var file_ext = extension_split[1];
        //comprobar la extension, solo imagenes
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif' ){
            fs.unlink(file_path,(err)=>{
                return res.status(200).send({
                    status:'error',
                    message:'la extension no es valida'
                });

            })
        }else{

            var articleId = req.params.id;

            Article.findOneAndUpdate({_id:articleId},{image: file_name,content: 'lo cambie perri'}, {new:true},(err,articleUpdated)=>{

                if(err||!articleUpdated){
                    return res.status(200).send({
                        status:'error',
                        article: 'error perro'
                    });
                }

                return res.status(200).send({
                    status:'success',
                    article: articleUpdated
                });
            })


        }
        //si todo es valido

        //buscar el articulo y asignarle el nombre de la magen


    },
    getImage: (req, res)=>{
        var file = req.params.image;
        var path_file= './upload/articles/'+file;

        fs.exists(path_file,(exists)=>{
            console.log(path_file);
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status:'error',
                    article: 'imagen no existe'
                });
            }
        });

    },
    search: (req, res)=>{
        //sacar el string a buscar
        var searchString = req.params.search;
        //find or 
        Article.find({ "$or":[
            {"title": {"$regex": searchString, "$options": "i"}},
            {"content": {"$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date','descending']])
        .exec((err,articles)=>{
            console.log(articles);
            if(err || !articles || articles.length <=0){
                return res.status(404).send({
                    status:'error',
                    article: 'article no existe'
                });
            }

            return res.status(200).send({
                status:'success',
                articles
            });
        })


    }
}; // end controller

module.exports = controller;