const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");  //biblioteca senha hash

router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index",{users: users});
    })
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create")
});

//senha hash
router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;


    User.findOne({where: {email: email}}).then( user => {  //não cadastrar email duplicado
        if(user == undefined){
            
            var selt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, selt);

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/");
            }).catch((err) => {
                res.redirect("/");
            });
   
        }else{
            res.redirect("/admin/users/create")
        }
    });

});

router.post("/users/delete", (req, res) => {
    var id = req.body.id;
    if(id != undefined) {
        if(!isNaN(id)){           //se id for diferente de numero
            User.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/users")
            });

        }else{ //nao for um numero
            res.redirect("/admin/users");
        }
    }else{ //null
        res.redirect("/admin/users");
    }
});




module.exports = router;
