import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { User, SafeUser, AuthTokenPayload, ApiResponse } from '../types/index.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

import { SignOptions } from 'jsonwebtoken';

const usersDb: Map<string, User> = new Map();

const sanitizeUser = (user: User): SafeUser => {
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
};

const createToken = (payload: AuthTokenPayload): string => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];
  return jwt.sign(payload, secret, { expiresIn });
};

const setTokenCookie = (res: Response, token: string): void => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = async (
  req: Request,
  res: Response<ApiResponse<{ user: SafeUser; token: string }>>,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const emailExists = Array.from(usersDb.values()).some(
      (u) => u.email.toLowerCase() === validatedData.email.toLowerCase()
    );
    if (emailExists) {
      res.status(409).json({
        success: false,
        error: 'An account with this email address already exists.',
      });
      return;
    }

    const usernameExists = Array.from(usersDb.values()).some(
      (u) => u.username.toLowerCase() === validatedData.username.toLowerCase()
    );
    if (usernameExists) {
      res.status(409).json({
        success: false,
        error: 'This username is already taken.',
      });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(validatedData.password, salt);

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      username: validatedData.username,
      email: validatedData.email.toLowerCase(),
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    usersDb.set(newUser.id, newUser);

    const tokenPayload: AuthTokenPayload = {
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
    };

    const token = createToken(tokenPayload);
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: {
        user: sanitizeUser(newUser),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response<ApiResponse<{ user: SafeUser; token: string }>>,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = Array.from(usersDb.values()).find(
      (u) => u.email.toLowerCase() === validatedData.email.toLowerCase()
    );

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(validatedData.password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
      return;
    }

    const tokenPayload: AuthTokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };

    const token = createToken(tokenPayload);
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user: sanitizeUser(user),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (
  _req: Request,
  res: Response<ApiResponse<null>>
): void => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
    data: null,
  });
};

export const getMe = (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<{ user: SafeUser }>>
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Not authenticated.',
    });
    return;
  }

  const user = usersDb.get(req.user.userId);
  if (!user) {
    res.status(404).json({
      success: false,
      error: 'User not found.',
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      user: sanitizeUser(user),
    },
  });
};
