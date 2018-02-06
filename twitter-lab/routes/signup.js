const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

/* GET signup page. */
router.get('/', function (req, res, next) {
    res.render('signup', {
        title: 'Express'
    });
});

/* POST signup page. */
router.post("/", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    if (username === "" || password === "") {
        res.render("signup", {
            message: "Indicate username and password"
        });
        return;
    }

    User.findOne({username}, "username", (err, user) => {
        if (user !== null) {
            res.render("signup", {
                message: "The username already exists"
            });
            return;
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username,
            password: hashPass
        });
        console.log(username);
        console.log(hashPass);
        newUser.save((err) => {
            if (err) {
                res.render("auth/signup", {
                    message: "Something went wrong"
                });
            } else {
                res.redirect("/");
            }
        });
    });
});



module.exports = router;