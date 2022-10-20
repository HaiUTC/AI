const { defaultRoom } = require("../constant.js");

//Update : database
const RoomController = {
  getRooms: () => {
      return defaultRoom;
  }
}

module.exports = RoomController;