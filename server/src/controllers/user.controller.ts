import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { updateProfileSchema } from '../schemas/user.schema.js';
import { ApiResponse, TDEEResult, UserProfile } from '../types/index.js';
import { calculateFullTDEE } from '../utils/tdee.js';
import { userRepository } from '../db/userRepository.js';

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<{ profile: UserProfile; tdeeResult: TDEEResult }>>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized.' });
      return;
    }

    let profile = await userRepository.getProfile(userId);
    if (!profile) {
      profile = await userRepository.upsertProfile(userId, {
        biologicalSex: 'male',
        age: 25,
        heightCm: 178,
        weightKg: 78,
        activityLevel: 'moderately_active',
        unitPreference: 'imperial',
        isSetupComplete: false,
      });
    }

    const tdeeResult = calculateFullTDEE(profile);

    res.status(200).json({
      success: true,
      data: {
        profile,
        tdeeResult,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<{ profile: UserProfile; tdeeResult: TDEEResult }>>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized.' });
      return;
    }

    const validatedData = updateProfileSchema.partial().parse(req.body);

    const updatedProfile = await userRepository.upsertProfile(userId, {
      ...validatedData,
      isSetupComplete: validatedData.isSetupComplete !== undefined ? validatedData.isSetupComplete : true,
    });

    const tdeeResult = calculateFullTDEE(updatedProfile);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        profile: updatedProfile,
        tdeeResult,
      },
    });
  } catch (error) {
    next(error);
  }
};
