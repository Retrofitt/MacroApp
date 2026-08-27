import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { updateProfileSchema } from '../schemas/user.schema.js';
import { ApiResponse, TDEEResult, UserProfile } from '../types/index.js';
import { calculateFullTDEE } from '../utils/tdee.js';

const profilesDb: Map<string, UserProfile> = new Map();

const getDefaultProfile = (userId: string): UserProfile => ({
  userId,
  biologicalSex: 'male',
  age: 25,
  heightCm: 178,
  weightKg: 78,
  bodyFatPercentage: undefined,
  activityLevel: 'moderately_active',
  unitPreference: 'imperial',
  isSetupComplete: false,
  updatedAt: new Date(),
});

export const getProfile = (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<{ profile: UserProfile; tdeeResult: TDEEResult }>>,
  next: NextFunction
): void => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized.' });
      return;
    }

    let profile = profilesDb.get(userId);
    if (!profile) {
      profile = getDefaultProfile(userId);
      profilesDb.set(userId, profile);
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

export const updateProfile = (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<{ profile: UserProfile; tdeeResult: TDEEResult }>>,
  next: NextFunction
): void => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized.' });
      return;
    }

    const existingProfile = profilesDb.get(userId) || getDefaultProfile(userId);
    const validatedData = updateProfileSchema.partial().parse(req.body);

    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...validatedData,
      bodyFatPercentage: validatedData.bodyFatPercentage ?? undefined,
      isSetupComplete: validatedData.isSetupComplete !== undefined ? validatedData.isSetupComplete : true,
      updatedAt: new Date(),
    };

    profilesDb.set(userId, updatedProfile);

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
