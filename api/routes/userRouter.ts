import express from "express";
import * as authController from "../controllers/authController";
import * as userController from "../controllers/userController";

const router = express.Router();

router.post("/signup", authController.signup);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
