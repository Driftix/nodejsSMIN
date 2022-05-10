const {connect} = require('mongoose');

function bdConnexion(){
    connect('mongodb://localhost:27017/projet_nodejs')
    .then(() => console.log('Connexion base de donnéees.'))
    .catch(error => console.log(error))
}
module.exports = bdConnexion