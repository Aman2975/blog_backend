import { Router } from "express";

import { authenticate } from "../../common/middlewares/auth.middleware";

import { upload } from "../../config/multer";
import { getMyPosts } from "./posts.controller";
import { getPostById } from "./posts.controller";
import { updatePost,deletePost } from "./posts.controller";
import { createPost } from "./posts.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  upload.single("image"),
  createPost
);

router.get(
  "/my-posts",
  authenticate,
  getMyPosts
);

router.get(
  "/:postId",
  authenticate,
  getPostById
);

router.patch(
  "/:postId",
  authenticate,
  upload.single("image"),
  updatePost
);

router.delete(
  "/:postId",
  authenticate,
  deletePost
);

export default router;