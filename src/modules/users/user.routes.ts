import { Router } from "express";

import { authenticate } from "../../common/middlewares/auth.middleware";
import { getProfile } from "./user.controller";

const router = Router();

router.get(
  "/profile",
  authenticate,
  getProfile
);

export default router;