import { Router } from "express";
import { authenticate } from "../../common/middlewares/auth.middleware";
import { getProfile } from "./user.controller";
import { updateProfile } from "./user.controller";
import { validate } from "../../common/middlewares/validate.middleware";
import { updateProfileSchema } from "./user.validation";
import { changePassword } from "./user.controller";
import { changePasswordSchema } from "./user.validation";
 

const router = Router();

router.get(
  "/profile",
  authenticate,
  getProfile
);

router.patch(
  "/profile",
  authenticate,
  validate(updateProfileSchema),
  updateProfile
);

router.patch(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  changePassword
);

export default router;