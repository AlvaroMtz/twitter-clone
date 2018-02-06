const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

/* cuando me piden la página del signup... */
router.get('/', function (req, res, next) {
    res.render('signup', {
        title: 'Express'
    });
});

/* CUANDO ME RELLENAN EL FORM DE SIGNUP */
router.post("/", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

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