'use strict'

var express = require('express');
var ArticleController = require('../controllers/article');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './upload/articles' })

//rutas prueba
router.post('/datos-curso', ArticleController.datosCurso);
router.get('/test-de-controlador', ArticleController.Test);


//rutas utiles
router.post('/save', ArticleController.save);
router.get('/Articulos/:last?', ArticleController.getArticles);
router.get('/Articulo/:id', ArticleController.getArticle);
router.put('/Articulo/:id', ArticleController.update);
router.delete('/Articulo/:id', ArticleController.delete);
router.post('/upload-image/:id',md_upload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search',ArticleController.search);
module.exports = router;