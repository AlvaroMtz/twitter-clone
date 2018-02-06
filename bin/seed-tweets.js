const mongoose = require('mongoose');
const {
    dbUrl
} = require('../config');
const Tweet = require('../models/Tweet');
const User = require('../models/User');
mongoose.connect(dbUrl).then(() => console.log('db running'));

function getRandomUser() {
    User.find().exec((err, result) => {
        let randomIndex = Math.floor(Math.random() * (result.length + 1));
        let tweet = new Tweet({
            tweet : "ola k ase",
            user_id: result[randomIndex]._id,
            user_name : result[randomIndex].username
        })
        //recorre el array de users y crea objetos
        tweet.save((err) => {
            if (err) {
                throw err;
            }
            console.log(`tweet added by ${tweet.user_name}`)
            //cierra la conexion
            mongoose.connection.close();
        });
    });
};
getRandomUser();
