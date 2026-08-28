import { z } from 'zod';

export const updateProfileSchema = z.object({
  biologicalSex: z.enum(['male', 'female']).optional(),
  age: z.number().int().min(12, 'Age must be at least 12').max(120, 'Invalid age').optional(),
  heightCm: z.number().min(50, 'Height too low').max(280, 'Height too high').optional(),
  weightKg: z.number().min(20, 'Weight too low').max(400, 'Weight too high').optional(),
  bodyFatPercentage: z
    .number()
    .min(3, 'Body fat must be at least 3%')
    .max(65, 'Body fat cannot exceed 65%')
    .optional()
    .nullable(),
  activityLevel: z.enum([
    'sedentary',
    'lightly_active',
    'moderately_active',
    'very_active',
    'extremely_active',
  ]).optional(),
  unitPreference: z.enum(['metric', 'imperial']).optional(),
  themePreference: z.enum(['light', 'dark']).optional(),
  selectedGoal: z.enum(['cutting', 'maintenance', 'bulking']).optional(),
  targetGoalWeight: z.number().min(10).max(500).optional().nullable(),
  isSetupComplete: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
