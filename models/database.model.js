const mongoose = require('mongoose');
const muv = require('mongoose-unique-validator')
const userSchema = mongoose.Schema({
    nom : {type : String, required : true},
    prenom : {type : String, required : true},
    mail : {type : String, required : true, unique : true},
    mdp : {type : String, required : true},
    date : {type : Date, default : Date.now},
})
mongoose.plugin(muv);
module.exports = mongoose.model('user', userSchema);