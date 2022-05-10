const joi = require('joi')

function userValidation(body){
    const userValidationSignUp = joi.object({
        nom : joi.string().min(2).max(30).trim().required(),
        prenom : joi.string().min(2).max(30).trim().required(),
        mail : joi.string().email().trim().required(),
        mdp : joi.string().min(8).max(50).trim().required()        
    })

    const userValidationLogin = joi.object({
        mail : joi.string().email().trim().required(),
        mdp : joi.string().min(8).max(50).trim().required()
    })
    return {
        userValidationSignUp : userValidationSignUp.validate(body),
        userValidationLogin : userValidationLogin.validate(body)
    }
}

module.exports = userValidation;