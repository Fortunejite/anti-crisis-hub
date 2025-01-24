import User from '@/models/User';
import { NextFunction, Request, Response } from 'express';
import { object, string, enum as enum_, array, boolean, number } from 'zod';
import { generateToken } from '@/utils/jwt';
import CustomError from '@/@types/customError';

const RegisterRequestBodySchema = object({
  email: string().email({ message: 'Invalid Email address' }),
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
const UpdateRequestBodySchema = object({
  email: string().email({ message: 'Invalid Email address' }).optional(),
  name: string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(40, { message: 'Name must not exceed 40 characters' })
    .optional(),
  password: string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(30, { message: 'Password must not exceed 30 characters' })
    .optional(),
  role: enum_(['Seeker', 'Provider', 'Admin']).optional(),
  phone: string().min(1, { message: 'Phone number is required' }).optional(),
  profileImage: string().optional().optional(),
  location: array(number()).length(2, 'Enter a valid location').optional(),
});

const LoginRequestBodySchema = object({
  email: string().email({ message: 'Invalid email address' }),
  password: string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(30, { message: 'Password must not exceed 30 characters' }),
  rememberMe: boolean().optional().default(false),
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
      const error = new CustomError('User already exists', 400);
      next(error);
      return;
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
      res.status(400).json({ message: 'Email does not exist' });
      return;
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: 'Password incorrect' });
      return;
    }

    const token = generateToken(
      {
        id: user._id as string,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
      rememberMe,
    );

    const { password: userPassword, ...userInfo } = user.toObject();
    res.status(200).json({ token, userInfo });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.user!;
    const user = await User.findOne({ email });
    const { password: userPassword, ...userInfo } = user!.toObject();
    res.status(200).json(userInfo);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.user!;
    const data = RegisterRequestBodySchema.parse(req.body);
    if (data.password) {
      res.status(400).json({ message: 'Password cannot be updated here' });
      return;
    }
    if (data.location) {
      data.location = {
        type: 'Point',
        coordinates: location,
      }
    }
    await User.updateOne({ email }, data);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
