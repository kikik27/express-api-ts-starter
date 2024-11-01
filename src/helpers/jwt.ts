import jwt from 'jsonwebtoken';
import { User } from "../db/schema/users";

export const generateAccessToken = (user: User) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "5m",
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

export const generateTokens = (user: User, jti: string) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);

  return {
    accessToken,
    refreshToken,
  };
}