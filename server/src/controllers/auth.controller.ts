import User from '@/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  profileImage?: string;
  location: [number, number];
}
interface LoginRequestBody {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role, phone, profileImage, location } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      ...(profileImage && { profileImage }),
      location: {
        type: 'Point',
        coordinates: location,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    next(error)
  }
};

// Login User
export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response, next: NextFunction) => {
  try {
    const { email, password, rememberMe } = req.body;
    const user = await User.findOne({ email }).lean();
    if (!user || Array.isArray(user) || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (Array.isArray(user)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: (user as any)._id, role: user.role }, JWT_SECRET, {
      expiresIn: rememberMe ? '7d' : '1d',
    });

    const { password: userPassword, ...userInfo } = user;
    res.status(200).json({ token, userInfo });
  } catch (error) {
    next(error)
  }
};
