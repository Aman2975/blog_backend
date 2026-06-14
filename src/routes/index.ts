import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/users/user.routes";
import postRoutes from "../modules/posts/posts.routes";
import feedRoutes from "../modules/feed/feed.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/feed", feedRoutes);

export default router;