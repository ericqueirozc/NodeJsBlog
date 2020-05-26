const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Articles = require('./Articles');
const slugify = require('slugify');


router.get('/admin/articles',(req,res)=>{
    Articles.findAll({include:{model: Category}}).then((articles)=>{
       res.render('admin/articles/index',{articles:articles})
    })
});

router.get('/admin/articles/new',(req,res)=>{
    Category.findAll().then(categories =>{
        res.render('admin/articles/new',{categories:categories});
    })
});

router.post('/articles/save',(req,res)=>{
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    Articles.create({
        title:title,
        slug: slugify(title),
        body:body,
        categoryId : category
    }).then(()=>{
        res.redirect('/admin/articles')
    })
});

router.post('/articles/delete',(req,res)=>{
    var id = req.body.id;
    Articles.findByPk(id).then(() =>{
        Articles.destroy({
            where: { id : id}
        }).then(()=>{res.redirect('/admin/articles')})
    });
});

module.exports = router;