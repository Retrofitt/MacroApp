import { z } from 'zod';

export const updateProfileSchema = z.object({
  biologicalSex: z.enum(['male', 'female']),
  age: z.number().int().min(12, 'Age must be at least 12').max(120, 'Invalid age'),
  heightCm: z.number().min(50, 'Height too low').max(280, 'Height too high'),
  weightKg: z.number().min(20, 'Weight too low').max(400, 'Weight too high'),
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
  ]),
  unitPreference: z.enum(['metric', 'imperial']).default('metric'),
  isSetupComplete: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
