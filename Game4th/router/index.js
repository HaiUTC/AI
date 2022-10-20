const express = require('express');
const RoomController = require('../controller/room');

const router = express.Router();

router.get('/', RoomController.getRooms);

module.exports = router