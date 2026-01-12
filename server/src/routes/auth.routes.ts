import { Router } from "express";
import { register, login, checkUsernameAvailability } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/check-username", checkUsernameAvailability);
router.post("/login", login);
router.get("/ping", (_, res) => {
    res.send("auth ok");
  });
  
export default router;
