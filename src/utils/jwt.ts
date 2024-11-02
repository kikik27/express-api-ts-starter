import jwt from 'jsonwebtoken';
import { User } from "../db/schema/users";

export const generateAccessToken = (user_id: string) => {
  return jwt.sign({ userId: user_id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
}

export const generateRefreshToken = (user: User, jti: string) => {
  return jwt.sign(
    {
      userId: user.id,
      jti,
    },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "8h",
    }
  );
}

export const generateTokens = (user_id: string) => {
  const accessToken = generateAccessToken(user_id);
  return { accessToken };
}