var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
var MongoClient = require("mongodb").MongoClient;
var mongoose = require("mongoose");
const shortUrl = require("./models/shortUrl"); 
var port = process.env.PORT || 8080 ;
app.use(bodyParser.json());
app.use(cors());
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/shortUrls');
mongoose.Promise = global.Promise;

app.use(express.static(__dirname+"/public"));

// app.get('/',function(req, res) {
//     res.send("ocschos");
// })
// create database entry
app.get('/new/:urlToShorten(*)',function(req,res){
    var urlToShorten = req.params.urlToShorten;
    console.log(urlToShorten);
    var expression = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = expression;
    if(regex.test(urlToShorten) === true){
        var short = Math.floor(Math.random() * 100000).toString();
        console.log("work" + short)
        var data = new shortUrl({
            originalUrl: urlToShorten,
            shorterUrl : short
        });
        data.save(err=>{
            if(err){
                return res.send("Something Error");
            }
            
        });
        res.json(data);
    }
    else {
        console.log('fails');
        var dataErr = new shortUrl({
            originalUrl: "you aren't inputed a url",
            shorterUrl: "InvalidURL"
        })
        res.json(dataErr);
    }
    // if(regex.test(urlToShorten)===true){
    //     var urlShorten ;
    //     shortUrl.count({}, function( err, count){
    //         if(err) throw err ;
    //         urlShorten = count+1 ;
    //         var data = new shortUrl({
    //         url : urlToShorten,
    //         urlShorten : urlShorten
    //     });
    //     data.save(err=>{urlToShorten
    //         if(err){
    //             return res.send("Something Error");
    //         }
            
    //     });
    //     var dataShow ={
    //         originalUrl : data.url,
    //         shortenerUrl : data.urlShorten
    //     }
    //     res.json(dataShow);
        
            
    //     })
        
        
        
    // } else {
    //     return res.send("URL wrong");
    // }
})

//querry and respon

app.get('/:urlShorten', function(req, res) {
    var urlshorten = req.params.urlShorten;
    var isnum = /^\d+$/.test(urlshorten);
    if(isnum){
        console.log(urlshorten);
        shortUrl.findOne({
            'shorterUrl': urlshorten},
            function(err,data){
                if(err) return res.send("Something error");
                if(data==null) return res.send("No information");
                return res.redirect(301,"http://"+data.originalUrl);
            })
    }
    else {
        res.send("Please pass a number");
    }
    
})

app.get("/check/allData",function(req,res){
   shortUrl.find({},function(err,data){
       res.json(data);
   }) 
});


// listen everything is working
app.listen(port, function(err){
    if(err) return console.error(err);
    console.log("server listen on:" + port );
})
