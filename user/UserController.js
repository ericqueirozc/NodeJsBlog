const express = require('express');
const router = express.Router();
const User = require('./User');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

//Rotas
router.get("/admin/users",(req,res)=>{
    User.findAll().then(users =>{
        res.render("admin/users/users",{users: users })
    }) ;
});


router.get("/admin/users/create",(req,res)=>{
    res.render('admin/users/create')
});

router.post("/users/create",(req,res)=>{
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where: {email: email}}).then( user => {
        if(user == undefined){

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password,salt);
        
        
            User.create({
                email:email,
                password:hash
            }).then(()=>{
                res.redirect("/");
            }).catch((err)=>{
                res.redirect("/");
            })

        }else{
            console.log('Usúario já existe!')
            res.redirect("/admin/users/create");            
        }
    })





});

module.exports = router;