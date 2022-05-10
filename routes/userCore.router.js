const {connexion, inscription, formIns, formCon, loadHomePage, registerValidation} = require('../controllers/database.controller')
var {} = require('express');

var express = require('express');

const router = express.Router();

router.get('/',loadHomePage);

router.post('/inscription', inscription);
router.get('/inscriptionForm', formIns);

router.post('/connexion', connexion);
router.get('/connexionForm', formCon);
router.get('/validation',registerValidation);


module.exports = router;