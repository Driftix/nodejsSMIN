const express = require('express');
const roomController = require('../controllers/room.controller')
const roomCoreRouter = express.Router();


roomCoreRouter.get('/',roomController.loadPage);
roomCoreRouter.post('/:id', roomController.createRoom);
//roomCoreRouter.get('/:user', roomController.testRead);

module.exports = roomCoreRouter;