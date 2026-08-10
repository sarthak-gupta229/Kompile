import { Router } from "express";

import {
  createRoom,
  joinRoom,
  getMyRooms,
  leaveRoomHandler,
  getRoomDetail,
} from "../controllers/room.controller.js";
import {
  createRoomValidator,
  joinRoomValidator,
  roomIdValidator,
} from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, createRoomValidator(), validate, createRoom);
router
  .route("/join-room")
  .post(verifyJWT, joinRoomValidator(), validate, joinRoom);
router.route("/mine").get(verifyJWT, getMyRooms);
router
  .route("/:roomId")
  .get(verifyJWT, roomIdValidator(), validate, getRoomDetail);
router
  .route("/:roomId/leave")
  .post(verifyJWT, roomIdValidator(), validate, leaveRoomHandler);

export default router;
