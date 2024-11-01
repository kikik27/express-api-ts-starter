import express from "express";
import { register } from "./auth.service";

const router = express.Router();

router.post('/register', register);

export default router;
