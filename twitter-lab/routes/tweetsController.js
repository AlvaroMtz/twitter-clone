const express = require("express");
const tweetsController = express.Router();
const Tweet = require('../models/Tweet');
const User = require('../models/User');
const moment = require("moment");

//user access
tweetsController.use((req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect("/login");
    }
});

// get my tweets
tweetsController.get("/my-tweets", (req, res, next) => {
    User
        .findOne({
            username: req.user.username
        }, "_id username")
        .exec((err, user) => {
            if (!user) {
                return;
            }

            Tweet.find({
                    "user_name": user.username
                }, "tweet created_at")
                .sort({
                    created_at: -1
                })
                .exec((err, tweets) => {
                    console.log("tweets");
                    res.render("tweets/index", {
                        username: user.username,
                        tweets,
                        moment
                    });
                });
        });
});

//get new tweet
tweetsController.get("/new", (req, res, next) => {
    res.render("tweets/new");
});

//post new tweet
tweetsController.post("/new", (req, res, next) => {
    const user = req.user.username;

    console.log(user);
    User.findOne({
        username: user
    }).exec((err, user) => {
        if (err) {
            return;
        }

        const newTweet = new Tweet({
            user_id: user._id,
            user_name: user.username,
            tweet: req.body.tweetText
        });

        newTweet.save((err) => {
            if (err) {
                res.render("tweets/new", {
                    username: user.username,
                    errorMessage: err.errors.tweet.message
                });
            } else {
                res.redirect("/tweets");
            }
        });
    });
});




module.exports = tweetsController;