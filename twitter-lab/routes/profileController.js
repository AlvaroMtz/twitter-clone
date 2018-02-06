const express = require("express");
const profileController = express.Router();

// User model
const User = require("../models/User");
const Tweet = require("../models/Tweet");

// Moment to format dates
const moment = require("moment");

profileController.get("/:username", (req, res, next) => {
    User
        .findOne({
            username: req.params.username
        }, "_id username")
        .exec((err, user) => {
            if (!user) {
                return next(err);
            }
            console.log(req.user);
            if (req.user) {
                isFollowing = req.user.following.indexOf(user._id.toString()) > -1;
            }
            Tweet.find({
                    "user_name": user.username
                }, "tweet created_at")
                .sort({
                    created_at: -1
                })
                .exec((err, tweets) => {
                    res.render("tweets/profile", {
                        tweets,
                        moment,
                        username: user.username,
                        session: req.user,
                        button_text: isFollowing ? "Unfollow" : "Follow"
                    });
                });
        });
});


profileController.use((req, res, next) => {
    if (req.user.username) {
        next();
    } else {
        res.redirect("/login");
    }
});

profileController.post("/:username/follow", (req, res) => {
    User.findOne({ "username": req.params.username }, "_id").exec((err, follow) => {
      if (err) {
        res.redirect("/profile/" + req.params.username);
        return;
      }
  
      User
        .findOne({ "username": req.user.username })
        .exec((err, currentUser) => {
          var followingIndex = currentUser.following.indexOf(follow._id);
  
          if (followingIndex > -1) {
            currentUser.following.splice(followingIndex, 1)
          } else {
            currentUser.following.push(follow._id);
          }
  
          currentUser.save((err) => {
            req.user.username = currentUser;
            res.redirect("/profile/" + req.params.username);
          });
        });
    });
  });


module.exports = profileController;