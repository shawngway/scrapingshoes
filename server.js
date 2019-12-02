const mongoose = require(`mongoose`);
var express = require("express");
var logger = require("morgan");



var axios = require("axios");
var cheerio = require("cheerio");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://shawngway:password1@ds163781.mlab.com:63781/heroku_x5w84tdn";
var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(
    MONGODB_URI,
    {
        useMongoClient: true
    }
);


app.get("/scrape", function (req, res) {
    axios.get("https://www.goodyear.com/en-US/tires/category/all-season").then(function (response) {
        var $ = cheerio.load(response.data);

        $(".tire-baseballcard").each(function (i, element) {
            var result = {};

            result.title = $(element).find("h3").text().trim();
            result.link = $(element).find("a").attr("href");
            const a = $(element).find("span.price").text();
            const str_a = a.toString();
            const number = Number(str_a.slice(0, 6));
            result.price = number;

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

        res.send("Scrape Complete");
    });
});

app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.listen(process.env.PORT || PORT, function () {
    console.log("App running on port " + PORT + "!");
});




















