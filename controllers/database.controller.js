const express = require('express')
const User = require('../models/database.model')
const userValidation = require('../database/validation.database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { response } = require('express')
const { render } = require('express/lib/response')
const nodemailer = require('nodemailer');
                    //Inscription
/**
 * Request
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
exports.inscription = (req, res) => {
    //Récup des données
    const {body} = req;
    console.log(req.body);
    //Validation des données
    const {error} = userValidation(body).userValidationSignUp 
    if(error) return res.status(401).json(error.details[0].message)
    //Hash du mdp
    bcrypt.hash(body.mdp, 5)
    .then(hash => {
        if(!hash) return res.status(500).json({msg : "Server error"})
        delete body.mdp
        console.log('OK1')
        new User({
            nom : body.nom,
            prenom : body.prenom,
            mail : body.mail,
            mdp : hash,
        })
        .save()
        .then((User) => {
            console.log(User);
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    auth: {
                        user: 'smin.iut1@gmail.com',
                        pass: 'ngtuackjzukfunrf'
                    }
                });

                transporter.verify(function (error, success) {
                    if (error) {
                        console.log("tamer");
                      console.log(error);
                    } else {
                      console.log("Server is ready to take our messages");
                      transporter.sendMail({
                            from: 'test.tamer@gmail.com',
                            to: User.mail,
                            subject: 'PixelWar register',
                            html: '<h1>Welcome to our website !</h1>' +'<p> Sir '  +User.nom +' we are happy that you joined our website PixelWar</p>'
                        });
                    }
                  });
            //res.status(201).json({msg : "User created"})
            res.redirect('/validation')
            // Ici il faut envoyer vers la page de confirmation
        })
        .catch((error) => res.status(500).json(error))
    })
    //console.log('KO2')
    .catch((error) => res.status(500).json(error))

}
                    //Connexion
/**
 * Request 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
exports.connexion = (req, res) => {

    //Ici on va faire la bascule vers le game.ejs 
    //en récupérant l'id de l'utilisateur
    //Récup des données
    const {mail, mdp} = req.body;
    console.log(mail, mdp);
    const {error} = userValidation(req.body).userValidationLogin
    if(error) return res.status(401).json(error.details[0].message)

    User.findOne({mail : mail})
    .then(User => {
        if(!User) return res.status(404).json({msg : "User not found"})
        //console.log(User)
        bcrypt.compare(mdp, User.mdp)
        .then((match) => {
            if(!match) return res.status(500).json({msg : "Server Error"})
            userInformations = JSON.stringify({
                name : User.prenom,
                id: User._id,
            })
            res.cookie('userData', JSON.parse(userInformations));
            res.redirect(`/room`);


        })
        .catch((error) => res.status(500).json(error))
    })
    .catch((error) => res.status(500).json(error))
    
    //res.send('Connexion');
}

exports.formIns = (req, res) => {
    res.render('../views/users/inscription.ejs');
}
exports.formCon = (req, res) => {
    //Changer le render

    res.render('../views/users/connexion.ejs');
}

exports.loadHomePage = (req,res) =>{
    res.render("homePage");
}

exports.registerValidation = (req,res)=>{
    res.render('../views/users/registervalidation.ejs');
}

