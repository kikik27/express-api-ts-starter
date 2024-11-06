import express, { Request, Response } from "express";
import { login, register, resetPassword, sendResetPassword, verifyEmail } from "./auth.service";
import { userForgotPasswordSchema, userLoginSchema, userRegistrationSchema, userResetPasswordSchema } from "./auth.schema";
import { isAuthenticate, validateRequest } from "../../../middlewares";
import { handleResponse } from "../../../helpers/response";

const router = express.Router();

router.post('/register', validateRequest(userRegistrationSchema), async (req, res, next) => {
  try {
    const token = await register(req.body);
    handleResponse(res, { status: 201, message: "User registered successfully", data: token });
  } catch (error) {
    next(error);
  }
});
router.post('/login', validateRequest(userLoginSchema), async (req, res, next) => {
  try {
    const user = await login(req.body);
    handleResponse(res, { status: 200, message: "User logged in successfully", data: user });
  } catch (error) {
    next(error);
  }
});

router.post('/forgot-password', validateRequest(userForgotPasswordSchema), async (req, res, next) => {
  try {
    const user = await sendResetPassword(req.body);
    handleResponse(res, { status: 200, message: "Reset password email sent successfully", data: user });
  } catch (error) {
    next(error);
  }
});

router.post('/reset-password', validateRequest(userResetPasswordSchema), async (req, res, next) => {
  try {
    const user = await resetPassword(req.body.token, req.body.password);
    handleResponse(res, { status: 200, message: "Password reset successfully", data: user });
  } catch (error) {
    next(error);
  }
}); 

router.post('/verify-email', async (req, res, next) => {
  try {
    const user = await verifyEmail(req.query.token as string);
    handleResponse(res, { status: 200, message: "Email verified successfully", data: user });
  } catch (error) {
    next(error);
  }
});

router.get('/me', isAuthenticate(), async (req: Request, res: Response) => {
  handleResponse(res, { status: 200, message: "User profile fetched successfully", data: req.user });
});

export default router;
