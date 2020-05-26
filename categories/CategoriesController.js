const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Category = require('./Category');
const slugify = require('slugify');

router.use(bodyParser.urlencoded({extended: false}))
router.use(bodyParser.json())

router.get('/admin/categories/new',(req,res)=>{
    res.render('admin/categories/new')
});


router.post('/categories/save',(req,res)=>{
    var title = req.body.title;
    if (title != undefined){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(()=>{res.redirect('/')})
    }else{
        res.redirect('/admin/categories/new')
    }
});

router.get('/admin/categories',(req,res)=>{
    
    Category.findAll().then(category => {
        res.render('admin/categories/index',{category : category })
    })
});

router.post('/categories/delete',(req,res)=>{
    var id = req.body.id;
    if (id != undefined){
        if (!isNaN(id)){

            Category.destroy({
                where: {
                    id: id
                }
            }).then(()=>{ 
                res.redirect('/admin/categories')
            })

        }else{
            res.redirect('/admin/categories')
        }
    }else{
        res.redirect('/admin/categories')
    }
});

router.get('/admin/categories/edit/:id',(req,res)=>{
    var id = req.params.id;
    Category.findByPk(id).then(category =>{
        (!isNaN(id)) ?  res.render('admin/categories/edit',{category : category}) : console.log('invalid Id') ;
    }).catch(error =>{console.log(error)})
});

router.post('/categories/update',(req,res)=>{
    var id = req.body.id;
    var title = req.body.title;
    var slug = slugify(title)
    Category.update({title: title, slug: slug },{
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/categories")
    })
});

module.exports = router;