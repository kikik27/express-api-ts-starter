import express from "express";
import { login, register, resetPassword, sendResetPassword } from "./auth.service";
import { userForgotPasswordSchema, userLoginSchema, userRegistrationSchema, userResetPasswordSchema } from "./auth.schema";
import { isAuthenticate, validateRequest } from "../../../middlewares";
import { createResponses } from "../../../helpers/response";

const router = express.Router();
const response = createResponses('auth')

router.post('/register', validateRequest(userRegistrationSchema), async (req, res) => {
  try {
    const token = await register(req.body);
    res.status(201).json(response.created(token, "User registered successfully"));
  } catch (error) {
    res.status(500).json(response.error(error));
  }
});
router.post('/login', validateRequest(userLoginSchema), async (req, res) => {
  try {
    const user = await login(req.body);
    res.status(200).json(response.fetched(user, "User logged in successfully"));
  } catch (error) {
    res.status(500).json(response.error(error));
  }
});

router.post('/forgot-password', validateRequest(userForgotPasswordSchema), async (req, res) => {
  try {
    const user = await sendResetPassword(req.body);
    res.status(200).json(response.fetched(user, "Reset password email sent successfully"));
  } catch (error) {
    res.status(500).json(response.error(error));
  }
});

router.post('/reset-password', validateRequest(userResetPasswordSchema), async (req, res) => {
  try {
    const user = await resetPassword(req.body.token, req.body.password);
    res.status(200).json(response.fetched(user, "Password reset successfully"));
  } catch (error) {
    res.status(500).json(response.error(error));
  }
}); 

router.get('/me', isAuthenticate, async (req, res) => {
  res.status(200).json(response.fetched(req.user, "User profile fetched successfully"));
});

export default router;
