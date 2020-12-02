const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const CategoriesController = require("./categories/CategoriesController");
const ArticlesController = require("./articles/ArticlesController");
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const usersController = require("./users/UsersController");
const User = require("./users/User");

//exibir html view engine
app.set('view engine', 'ejs');

//static
app.use(express.static('public'));

//body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//connection
connection
    .authenticate()
    .then(() => {
        console.log("conexao feita!")
    })
    .catch((error) => {
        console.log("error");
    })

    app.use("/",ArticlesController);
    app.use("/",CategoriesController); //ultilizar as rotas de outro arquivo
    
    app.use("/",usersController)


app.get("/", (req, res) => {
    Article.findAll({
        order:[
            ['id', 'DESC']
        ],
        limit: 4          //limitar o numero de artigos que aparece na home
    }).then(articles => {
        Category.findAll().then(categories => {
        res.render("index" , {articles: articles, categories: categories});
        });
    });
});

app.get("/:slug", (req, res) => { //usando slug para acesar as paginas do artigos com o botão na tela home
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
             Category.findAll().then(categories => {
                res.render("article" , {article: article, categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch( erro => {
        res.redirect("/");
    })
})

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories}) //
            })
        }else{
            res.redirect("/")
        }
    }).catch( error => {
        res.redirect("/")
    })
})

app.listen(8080, () => {console.log("o servidor")});