import {Router} from 'express';
import { authenticate } from "../../common/middlewares/auth.middleware";
import { getSavedPosts, savePost, unsavePost } from "./saved.controller";

const router = Router();

router.get(
  "/",
  authenticate,
  getSavedPosts
);

router.post(
  "/:postId",
  authenticate,
  savePost
);

router.delete(
    "/:postId",
    authenticate,
    unsavePost
);
export default router;