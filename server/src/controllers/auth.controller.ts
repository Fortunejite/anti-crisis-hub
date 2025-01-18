import User from '@/models/User';
import { NextFunction, Request, Response } from 'express';
import { object, string, enum as enum_, array, boolean, number } from 'zod';
import { generateToken } from '@/utils/jwt';

const RegisterRequestBodySchema = object({
  email: string().email({ message: 'Invalid email address' }),
  name: string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(40, { message: 'Name must not exceed 40 characters' }),
  password: string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(30, { message: 'Password must not exceed 30 characters' }),
  role: enum_(['Seeker', 'Provider', 'Admin']),
  phone: string().min(1, { message: 'Phone number is required' }),
  profileImage: string().optional(),
  location: array(number()).length(2, 'Enter a valid location'),
});

const LoginRequestBodySchema = object({
  email: string().email({ message: 'Invalid email address' }),
  password: string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(30, { message: 'Password must not exceed 30 characters' }),
  rememberMe: boolean(),
});

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password, role, phone, profileImage, location } =
      RegisterRequestBodySchema.parse(req.body);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return
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
    next(error);
  }
};

// Login User
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, rememberMe } = LoginRequestBodySchema.parse(
      req.body,
    );
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid email' });
      return;
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid password' });
      return;
    }

    const token = generateToken({ id: user._id, email: user.email, role: user.role, profileImage: user.profileImage }, rememberMe);

    const { password: userPassword, ...userInfo } = user._doc;
    res.status(200).json({ token, userInfo });
  } catch (error) {
    next(error);
  }
};
