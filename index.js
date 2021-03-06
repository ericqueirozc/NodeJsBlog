const express = require('express');
const app = express();
const connection = require('./database/database')
const bodyParser = require('body-parser')
const session = require('express-session')

const articlesController = require('./articles/ArticlesController');
const categoriesController = require('./categories/CategoriesController');
const usersController = require('./user/UserController');

const Article = require('./articles/Articles');
const Category = require('./categories/Category')
const User = require('./user/User')

app.use('/',usersController);
app.use('/',categoriesController);
app.use('/',articlesController);

//View engine
app.set('view engine','ejs')


//Sessions
app.use(session({
    secret: "segredo",
    cookie: {
        maxAge: 30000
    }
}));


// Static
app.use(express.static('public'));

// Body-parses
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Database
connection
    .authenticate()
    .then(()=>{
        console.log("Conexão com banco de dados estabelecida")
    })
    .catch((error)=>{
        console.log(error)});


app.get('/',(req,res)=>{
    Article.findAll({
        order:[
            ['id','DESC']
        ],
        limit: 1
    }).then(article =>{ 
        Category.findAll().then((categories)=>{
        res.render('index',{article:article, categories: categories})
        })
    });
});

app.get('/:slug',(req,res)=>{
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug: slug
        }
    }).then(article => {
        if (article != undefined){
                Category.findAll().then((categories)=>{
                res.render('article',{article:article, categories: categories})
                })
        }else{
            res.redirect("/")
        }
    }).catch(error => {
        console.log(error)
    })
});

app.get('/category/:slug',(req,res)=>{
    var slug = req.params.slug;
    Category.findOne({
        where:{
            slug: slug
        },
        include:[{model: Article}]
    }).then(category =>{
        if (category != undefined){
            Category.findAll().then(categories =>{
                res.render("index",{article:category.articles, categories: categories})
            });
        }else{
            res.redirect("/");
        }
    }).catch(error =>{
        res.redirect('/')
    })
});

app.listen(8080,(req,res)=>{
    console.log('Servidor rodando em localhost:8080')
})
