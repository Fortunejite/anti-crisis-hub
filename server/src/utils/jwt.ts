import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  profileImage: string;
}

export const generateToken = (payload: JwtPayload, rememberMe: boolean): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: rememberMe ? '7d' : '1d' });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
