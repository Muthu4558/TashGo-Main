import express from "express";
import { isAdminRoute, protectRoute } from "../middlewares/authmiddlewave.js";
import {
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  getAdmin,
  getTeamList,
  getUserDetails,
  getUserTasks,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from "../controllers/userControllers.js";

const router = express.Router();

router.post("/register",protectRoute, registerUser, isAdminRoute);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/admin", protectRoute, getAdmin)
router.get("/get-team", protectRoute, getTeamList);
router.get("/notifications", protectRoute);
// Route to fetch tasks for a particular user
router.get("/:userId/tasks", getUserTasks);
router.get("/:userId", getUserDetails);
router.put("/profile", protectRoute, updateUserProfile);
router.put("/read-noti", protectRoute);
router.put("/change-password", protectRoute, changeUserPassword);

// //   FOR ADMIN ONLY - ADMIN ROUTES
router
  .route("/:id")
  .put(protectRoute, isAdminRoute, activateUserProfile)
  .delete(protectRoute, isAdminRoute, deleteUserProfile);

export default router;