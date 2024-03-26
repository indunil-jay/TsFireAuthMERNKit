import express from "express";
import * as authController from "../controllers/authController";
import * as userController from "../controllers/userController";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.singin);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

router
  .route("/:id")
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    userController.deleteUser
  )
  .post(userController.createUser)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    userController.updateUser
  );

router.use(
  authController.protect,
  authController.restrictTo("admin", "moderator")
);

router.route("/").get(userController.getAllUsers);
router.route("/:id").get(userController.getUser);

export default router;
