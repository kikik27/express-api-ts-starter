import express from "express";
import { register } from "./auth.service";
import { userRegistrationSchema } from "./user.schema";
import { validateRequest } from "../../../middlewares";

const router = express.Router();

router.post('/register', validateRequest(userRegistrationSchema), register);

export default router;
