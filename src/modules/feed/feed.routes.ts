import { Router } from "express";

import {
  getFeedPosts,
    searchPosts,
} from "./feed.controller";

const router = Router();

router.get(
  "/search",
  searchPosts
);

router.get(
  "/",
  getFeedPosts
);

export default router;